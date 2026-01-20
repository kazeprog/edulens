import { GoogleGenerativeAI, GenerativeModel, GenerationConfig, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { redis } from "@/lib/redis";

if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error("GOOGLE_GEMINI_API_KEY must be defined in .env.local");
}

// Support multiple API keys for rotation
const apiKeys = [
    process.env.GOOGLE_GEMINI_API_KEY,
    process.env.GOOGLE_GEMINI_API_KEY_2
].filter((key): key is string => !!key);

console.log(`Loaded ${apiKeys.length} Gemini API keys.`);

const ACTIVE_KEY_INDEX_REDIS_KEY = "GEMINI_ACTIVE_KEY_INDEX";

export class GeminiModelWrapper {
    private models: GenerativeModel[];
    private currentKeyIndex = 0;
    private config: { model: string; generationConfig?: GenerationConfig; safetySettings?: any[] };

    constructor(keys: string[], config: { model: string; generationConfig?: GenerationConfig; safetySettings?: any[] }) {
        this.config = config;
        this.models = keys.map(key => {
            const genAI = new GoogleGenerativeAI(key);
            return genAI.getGenerativeModel(config);
        });

        // Initialize current key from Redis (async, so essentially "eventually consistent" for the first call)
        this.initCurrentKey();
    }

    private async initCurrentKey() {
        try {
            const storedIndex = await redis.get<number>(ACTIVE_KEY_INDEX_REDIS_KEY);
            if (storedIndex !== null && typeof storedIndex === "number" && storedIndex >= 0 && storedIndex < this.models.length) {
                this.currentKeyIndex = storedIndex;
                console.log(`Initialized Gemini API Key from Redis: #${this.currentKeyIndex}`);
            }
        } catch (error) {
            console.error("Failed to retrieve Gemini active key index from Redis:", error);
        }
    }

    private get currentModel(): GenerativeModel {
        return this.models[this.currentKeyIndex];
    }

    private async rotateKey() {
        if (this.models.length <= 1) return;

        const nextIndex = (this.currentKeyIndex + 1) % this.models.length;
        this.currentKeyIndex = nextIndex;
        console.warn(`Switched to Gemini API Key #${this.currentKeyIndex}`);

        // Persist new index to Redis with 24h expiration
        try {
            await redis.set(ACTIVE_KEY_INDEX_REDIS_KEY, nextIndex, { ex: 60 * 60 * 24 });
        } catch (error) {
            console.error("Failed to persist new Gemini active key index to Redis:", error);
        }
    }

    async generateContent(params: any): Promise<any> {
        let attempts = 0;
        // Try each key once before giving up (or more if needed, but checking all keys once is reasonable for a 429)
        const maxAttempts = this.models.length;

        while (attempts < maxAttempts) {
            try {
                return await this.currentModel.generateContent(params);
            } catch (error: any) {
                // Check for 429 Limit Exceeded or 503 Service Unavailable
                const isRateLimit = error.message?.includes("429") || error.status === 429 || error.statusText?.includes("Too Many Requests");
                const isServiceOverloaded = error.message?.includes("503") || error.status === 503 || error.statusText?.includes("Service Unavailable") || error.message?.includes("overloaded");

                if (isRateLimit || isServiceOverloaded) {
                    console.warn(`Gemini API Error (Rate Limit or Overloaded) on key #${this.currentKeyIndex}. Rotating...`);
                    await this.rotateKey();
                    attempts++;

                    // 503の場合は少し待機してからリトライするのが望ましい
                    if (isServiceOverloaded) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    continue;
                }

                // If it's not a rate limit error, throw strictly
                throw error;
            }
        }

        // すべての試行が失敗した場合、フォールバックモデルがあれば試す
        // すべての試行が失敗した場合、フォールバックモデルがあれば試す
        console.warn(`All ${this.models.length} Gemini API keys failed with primary model. Trying fallback model: gemini-2.5-flash-lite`);

        try {
            // 新しいインスタンスを作成してフォールバックモデルで試行
            // APIキーは現在のものを使用
            const fallbackGenAI = new GoogleGenerativeAI(apiKeys[this.currentKeyIndex]);
            const fallbackModel = fallbackGenAI.getGenerativeModel({
                ...this.config,
                model: "gemini-2.5-flash-lite"
            });
            return await fallbackModel.generateContent(params);
        } catch (fallbackError) {
            console.error("Fallback model also failed:", fallbackError);
            throw new Error(`All ${this.models.length} Gemini API keys and fallback model have failed.`);
        }
    }
}

// Wrapper behaves like the original model object for generateContent
export const model = new GeminiModelWrapper(apiKeys, {
    model: "gemini-2.5-flash",
    // Relax safety settings to prevent blocking harmless content
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
        responseMimeType: "application/json"
    }
});
