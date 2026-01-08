import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Request schema
const detailSchema = z.object({
    transcribed_text: z.string().min(1),
    level: z.string().optional(),
    examType: z.enum(["eiken", "university"]).optional().default("eiken"),
    problemType: z.string().optional().default("opinion"),
    universityName: z.string().optional(),
    wordLimit: z.string().optional(),
});

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
        // 1. Authenticate User (No Rate Limit Check, No Increment)
        // Check if user is at least allowed to access (could add blocking logic here)
        const authHeader = req.headers.get('Authorization');
        if (authHeader) {
            // Optional: verify token validity if strictly needed, but 'basic' step already gated entry.
            // For now, rely on standard API protection if any.
        }

        const body = await req.json();
        const result = detailSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid Request", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { transcribed_text, level, problemType, examType, universityName, wordLimit } = result.data;
        const eikenLevelStr = EikenLevelsMap[level || "2"] || `${level}級`;

        // 2. Construct Prompt for Detail (Corrections & Advice)
        let systemInstruction = "";
        let criteria = "";

        let wordLimitInstruction = "";

        // Logic branching for Prompt Construction (Simplified from original route.ts)
        if (examType === "university") {
            const universityContext = universityName ? `志望大学・学部: ${universityName}` : "難関国公立・私立大学レベル";
            systemInstruction = `あなたは予備校のベテラン英語講師です。${universityContext}の合格を目指し、厳しく指導してください。`;
            criteria = "大学入試基準";
        } else {
            systemInstruction = `あなたは英検${eikenLevelStr}のプロの採点官・英語教師です。`;
            criteria = `英検${eikenLevelStr}基準`;
            wordLimitInstruction = wordLimit
                ? `（語数制限: ${wordLimit}語程度を必ず守ってください）`
                : `（${eikenLevelStr}の標準的な語数を必ず守ってください）`;
        }

        const prompt = `
# Role
${systemInstruction}

# Input Data
受験者の英作文（テキスト）:
"""
${transcribed_text}
"""

# Task
${criteria}に基づき、詳細な添削とアドバイスを行ってください。

1. **添削 (Correction)**:
   - 文法ミス、不自然なコロケーション、より洗練された表現への書き換えを提案してください。
   - なぜ間違っているのか解説してください。

2. **アドバイス (Advice)**:
   - 合格に向けた具体的な学習アドバイスを記述してください。

3. **模範解答 (Model Answer)**:
   - 受験者の元の英文をベースにし、上記のアドバイスと添削内容を反映させた模範解答を作成してください。
   - 原文の意図や文脈をできるだけ尊重しつつ、自然で高度な英語表現にリライトしてください。
   - 全くゼロから書き直すのではなく、「受験者が本来書きたかった内容をより良くした」形にしてください。${wordLimitInstruction}

# Output Format (JSON Only)
JSON以外のテキストは一切含めないでください。

**重要な注意事項**:
- "advice" や "explanation" のテキストには、**Markdown記号（*, #, - 等）を使用しないでください**。プレーンテキストで読みやすく記述してください。
- 文中の英単語を無意味にクォーテーション（'word' や "word"）で囲まないでください。自然な文章にしてください。

JSON Schema:
{
  "corrections": [
    {
      "original": "修正前の箇所",
      "fixed": "修正後の表現",
      "type": "Grammar" | "Vocabulary" | "Structure" | "Content",
      "explanation": "日本語での解説（Markdown不可、プレーンテキスト）"
    }
  ],
  "advice": "全体的な日本語でのアドバイス（Markdown不可、プレーンテキスト）",
  "model_answer": "模範解答"
}
`;

        // 3. Call Gemini (Text Only - Fast)
        let parsedResponse;
        let attempt = 0;
        const maxAttempts = 3;

        while (attempt < maxAttempts) {
            try {
                attempt++;
                const generatedContent = await model.generateContent(prompt);
                const responseText = generatedContent.response.text();
                const cleanedJson = responseText.replace(/```json|```/g, "").trim();
                const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
                const jsonString = jsonMatch ? jsonMatch[0] : cleanedJson;
                parsedResponse = JSON.parse(jsonString);
                break;
            } catch (error: any) {
                console.warn(`Gemini API/Parsing attempt ${attempt} failed:`, error.message);
                if (attempt === maxAttempts) throw new Error("Failed to generate valid detailed analysis.");
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }

        return NextResponse.json(parsedResponse);

    } catch (error: any) {
        console.error("Analysis Detail Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: error.message || String(error) },
            { status: 500 }
        );
    }
}
