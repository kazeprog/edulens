import {
    GoogleGenerativeAI,
    GenerateContentRequest,
    GenerationConfig,
    GenerateContentResult,
    HarmBlockThreshold,
    HarmCategory,
    Part,
} from "@google/generative-ai";
import { redis } from "@/lib/redis";
import { getServerGeminiModelSettings } from "@/lib/server-gemini-model-config";

if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error("GOOGLE_GEMINI_API_KEY must be defined in .env.local");
}

const apiKeys = [
    process.env.GOOGLE_GEMINI_API_KEY,
    process.env.GOOGLE_GEMINI_API_KEY_2,
].filter((key): key is string => !!key);

console.log(`Loaded ${apiKeys.length} Gemini API keys.`);

const ACTIVE_KEY_INDEX_REDIS_KEY = "GEMINI_ACTIVE_KEY_INDEX";

type GeminiBaseConfig = {
    generationConfig?: GenerationConfig;
    safetySettings?: Array<{
        category: HarmCategory;
        threshold: HarmBlockThreshold;
    }>;
};

type GeminiGenerateContentParams = string | GenerateContentRequest | Array<string | Part>;

function isGeminiApiError(error: unknown): error is {
    message?: string;
    status?: number;
    statusText?: string;
} {
    return typeof error === "object" && error !== null;
}

export class GeminiModelWrapper {
    private keys: string[];
    private currentKeyIndex = 0;
    private config: GeminiBaseConfig;

    constructor(keys: string[], config: GeminiBaseConfig) {
        this.keys = keys;
        this.config = config;
        this.initCurrentKey();
    }

    private async initCurrentKey() {
        try {
            const storedIndex = await redis.get<number>(ACTIVE_KEY_INDEX_REDIS_KEY);
            if (storedIndex !== null && typeof storedIndex === "number" && storedIndex >= 0 && storedIndex < this.keys.length) {
                this.currentKeyIndex = storedIndex;
                console.log(`Initialized Gemini API Key from Redis: #${this.currentKeyIndex}`);
            }
        } catch (error) {
            console.error("Failed to retrieve Gemini active key index from Redis:", error);
        }
    }

    private getModel(modelName: string) {
        const genAI = new GoogleGenerativeAI(this.keys[this.currentKeyIndex]);
        return genAI.getGenerativeModel({
            ...this.config,
            model: modelName,
        });
    }

    private async rotateKey() {
        if (this.keys.length <= 1) return;

        const nextIndex = (this.currentKeyIndex + 1) % this.keys.length;
        this.currentKeyIndex = nextIndex;
        console.warn(`Switched to Gemini API Key #${this.currentKeyIndex}`);

        try {
            await redis.set(ACTIVE_KEY_INDEX_REDIS_KEY, nextIndex, { ex: 60 * 60 * 24 });
        } catch (error) {
            console.error("Failed to persist new Gemini active key index to Redis:", error);
        }
    }

    async generateContent(params: GeminiGenerateContentParams): Promise<GenerateContentResult> {
        const geminiSettings = await getServerGeminiModelSettings();
        const primaryModel = geminiSettings.gemini_model_shared_primary;
        const fallbackModel = geminiSettings.gemini_model_shared_fallback;

        let attempts = 0;
        const maxAttempts = this.keys.length;

        while (attempts < maxAttempts) {
            try {
                return await this.getModel(primaryModel).generateContent(params);
            } catch (error) {
                const errorMessage = isGeminiApiError(error) ? error.message : undefined;
                const errorStatus = isGeminiApiError(error) ? error.status : undefined;
                const errorStatusText = isGeminiApiError(error) ? error.statusText : undefined;
                const isRateLimit = errorMessage?.includes("429") || errorStatus === 429 || errorStatusText?.includes("Too Many Requests");
                const isServiceOverloaded = errorMessage?.includes("503") || errorStatus === 503 || errorStatusText?.includes("Service Unavailable") || errorMessage?.includes("overloaded");

                if (isRateLimit || isServiceOverloaded) {
                    console.warn(`Gemini API Error on key #${this.currentKeyIndex} with ${primaryModel}. Rotating...`);
                    await this.rotateKey();
                    attempts++;

                    if (isServiceOverloaded) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    continue;
                }

                throw error;
            }
        }

        console.warn(`All ${this.keys.length} Gemini API keys failed with primary model. Trying fallback model: ${fallbackModel}`);

        try {
            return await this.getModel(fallbackModel).generateContent(params);
        } catch (fallbackError) {
            console.error("Fallback model also failed:", fallbackError);
            throw new Error(`All ${this.keys.length} Gemini API keys and fallback model have failed.`);
        }
    }
}

export const model = new GeminiModelWrapper(apiKeys, {
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ],
    generationConfig: {
        responseMimeType: "application/json",
    },
});
