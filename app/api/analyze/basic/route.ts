import { NextRequest, NextResponse } from "next/server";
import { ratelimitFree, ratelimitGuest } from "@/lib/redis";
import { model } from "@/lib/gemini";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Request schema
const analyzeSchema = z.object({
    images: z.array(z.string()).min(1).max(2), // Base64 strings, expect 1 or 2 images
    level: z.string().optional(), // Eiken level or empty for university
    examType: z.enum(["eiken", "university"]).optional().default("eiken"),
    problemType: z.string().optional().default("opinion"),
    universityName: z.string().optional(), // Target university for university mode
    wordLimit: z.string().optional(), // Word limit for university mode
});

// Response schema for Gemini reference in prompt
const EikenLevelsMap: Record<string, string> = {
    "3": "3級",
    "pre-2": "準2級",
    "pre-2-plus": "準2級プラス",
    "2": "2級",
    "pre-1": "準1級",
    "1": "1級",
};

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate User & Check Pro Status
        const authHeader = req.headers.get('Authorization');
        let user = null;
        let isPro = false;

        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const supabase = createClient(
                process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_MISTAP_SUPABASE_ANON_KEY!
            );
            const { data: { user: authUser } } = await supabase.auth.getUser(token);

            if (authUser) {
                user = authUser;
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_pro')
                    .eq('id', user.id)
                    .single();
                if (profile?.is_pro) isPro = true;
            }
        }

        // 2. Rate Limiting (Primary Check Here)
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        let identifier = ip; // Default to IP for guests
        let limitResult = { success: true, limit: 0, remaining: 0, reset: 0 };

        if (!isPro) {
            if (user) {
                // Free User (3 requests/day)
                identifier = user.id; // Use User ID for logged-in users
                limitResult = await ratelimitFree.limit(identifier);
            } else {
                // Guest User (1 request/day)
                limitResult = await ratelimitGuest.limit(identifier);
            }

            if (!limitResult.success) {
                return NextResponse.json(
                    {
                        error: "Rate Limit Exceeded",
                        message: user
                            ? "本日の利用回数（3回）を超えました。Proプランにアップグレードすると無制限で利用できます。"
                            : "本日の利用回数（1回・お試し）を超えました。ログインすると1日3回まで利用できます。"
                    },
                    { status: 429 }
                );
            }
        }

        // 3. Parse Request
        const body = await req.json();
        const result = analyzeSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid Request", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { images, level, problemType, examType, universityName, wordLimit } = result.data;

        // ---------------------------------------------------------
        // Construct System Prompt (Minimal for Speed)
        // ---------------------------------------------------------

        let contextInstruction = "";

        if (examType === "university") {
            const universityContext = universityName ? `志望大学・学部: ${universityName}` : "難関国公立・私立大学レベル";
            contextInstruction = `あなたは日本の難関大学（${universityContext}）の入試英語専門の採点官です。`;
        } else {
            const eikenLevelStr = EikenLevelsMap[level || "2"] || `${level}級`;
            contextInstruction = `あなたは英検（実用英語技能検定）${eikenLevelStr}の採点官です。`;
        }

        // 4. Prompt for Basic Analysis (Scan & Score)
        const prompt = `
# Role
${contextInstruction}

# Task
画像（手書きの英作文解答）を読み取り、以下の処理を**迅速に**行ってください。

1. **文字起こし (Transcription)**:
   - 手書き文字をテキスト化してください。スペルミスもそのまま読み取ってください。
   - **重要**: 画像内に問題文が含まれている場合、そこに「語数制限（例: 80〜100語）」の記載があれば、その数値を読み取ってください。

2. **概略採点 (Quick Scoring)**:
   - 以下の基準で採点してください（英検の場合各4点満点、大学入試の場合各10点満点）。
   - 内容 (Content)
   - 構成 (Structure)
   - 語彙 (Vocabulary)
   - 文法 (Grammar)

# Output Format (JSON Only)
JSON以外のテキストは一切含めないでください。
**重要**: 出力テキストにMarkdown記号（**, ##, - 等）を使用しないでください。プレーンテキストで記述してください。

JSON Schema:
{
  "transcribed_text": "読み取った英文",
  "topic_recognition": "画像から読み取ったTOPICや問題の内容（日本語で記述。空欄可）",
  "detected_word_limit": "画像から読み取った語数制限（例: '80-100'）。見つからない場合は null",
  "score": {
    "content": number,
    "structure": number,
    "vocabulary": number,
    "grammar": number,
    "total": number
  },
  "is_passing_level": boolean
}
`;

        // 5. Increment usage stats for logged-in users (ASYNC)
        if (user) {
            (async () => {
                const supabase = createClient(
                    process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY!
                );
                const { error } = await supabase.rpc('increment_total_writing_checks', { user_id: user.id });
                if (error) {
                    const { data: profile } = await supabase.from('profiles').select('total_writing_checks').eq('id', user.id).single();
                    const current = profile?.total_writing_checks || 0;
                    await supabase.from('profiles').update({ total_writing_checks: current + 1 }).eq('id', user.id);
                }
            })().catch(err => console.error("Failed to update stats:", err));
        }

        // 6. Call Gemini
        return await generateGeminiResponse(prompt, images);

        // Helper function
        async function generateGeminiResponse(prompt: string, images: string[]) {
            const imageParts = images.map(base64 => ({
                inlineData: {
                    data: base64,
                    mimeType: "image/jpeg"
                }
            }));

            let parsedResponse;
            let attempt = 0;
            const maxAttempts = 3;

            while (attempt < maxAttempts) {
                try {
                    attempt++;
                    const generatedContent = await model.generateContent([prompt, ...imageParts]);
                    const responseText = generatedContent.response.text();
                    const cleanedJson = responseText.replace(/```json|```/g, "").trim();
                    const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
                    const jsonString = jsonMatch ? jsonMatch[0] : cleanedJson;
                    parsedResponse = JSON.parse(jsonString);
                    break;
                } catch (error: any) {
                    console.warn(`Gemini API/Parsing attempt ${attempt} failed:`, error.message);
                    if (attempt === maxAttempts) throw new Error("Failed to generate valid analysis.");
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
            return NextResponse.json(parsedResponse);
        }

    } catch (error: any) {
        console.error("Analysis Basic Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: error.message || String(error) },
            { status: 500 }
        );
    }
}
