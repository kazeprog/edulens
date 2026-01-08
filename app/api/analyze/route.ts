import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "@/lib/redis";
import { model } from "@/lib/gemini";
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

// Response schema for Gemini (for reference in prompt)
// Eiken Level Mapping
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
        // 1. Rate Limiting (Temporarily Disabled)
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

        // 2. Parse and Validate Request
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
        // A. UNIVERSITY EXAM LOGIC
        // ---------------------------------------------------------
        if (examType === "university") {
            const universityContext = universityName ? `志望大学・学部: ${universityName}` : "難関国公立・私立大学レベル";
            const limitContext = wordLimit ? `指定語数: ${wordLimit} words` : "語数指定なし";

            const prompt = `
# Role
あなたは日本の難関大学（東京大学、京都大学、早慶など）の入試英語を知り尽くした、予備校のベテラン英語講師です。
生徒の答案を、大学入試の採点基準に基づいて厳格に添削し、合格レベルへ引き上げる指導を行います。
${universityContext} の対策として適切な指導をしてください。

# Input Data
2枚の画像が提供されます（1枚の場合もあります）：
1. **問題文**: 
   - 「自由英作文（テーマについて意見を述べる）」または
   - 「和文英訳（日本語を英語に訳す）」の課題が書かれています。
   - ※画像が1枚の場合は、解答のみから問題内容を推測してください。
2. **解答**: 受験者が手書きで書いた英作文です。
${limitContext}

# Task
画像を分析し、以下のステップで処理を行ってください。

## Step 1: 出題形式の特定 (Analyze Question Type)
問題文の画像を読み、これが「自由英作文 (Free Composition)」なのか「和文英訳 (Translation)」なのかを判断してください。
- **和文英訳の場合**: 原文の日本語のニュアンスが正しく伝わっているかを最重視します。
- **自由英作文の場合**: 論理構成（Logic）と説得力を最重視します。

## Step 2: 文字起こし (Transcription)
手書きの解答をそのままテキスト化してください。スペルミスも修正せずに読み取ります。

## Step 3: 採点 (Scoring)
大学入試の基準で、以下の4観点（各10点満点→合計40点満点に換算）で採点してください。
※英検よりも「論理性」と「表現の硬さ（Formalさ）」を厳しく見てください。

- **内容 (Content/Relevance)**: 
  - (自由英作) 出題の意図に正面から答えているか。論理が飛躍していないか。
  - (和文英訳) 原文の意味を漏らさず訳出できているか。
- **構成 (Structure/Logic)**: 
  - 導入・本論・結論の構成が明確か。Discourse Marker（接続詞）が効果的に使われているか。
- **語彙 (Vocabulary)**: 
  - childishな単語（so, big, goodなど）を避け、academicな単語（therefore, significant, beneficialなど）を使えているか。
- **文法 (Grammar)**: 
  - 致命的な文法ミスがないか。文構造が単調でないか（無生物主語や関係詞の活用）。

## Step 4: 添削 (Correction)
- **「減点されない英語」**と**「加点される英語」**の両面から指導してください。
- 文法ミスは徹底的に指摘してください。
- "I think..." のような稚拙な表現があれば、"It is arguably that..." などのアカデミックな表現への書き換えを提案してください。

## Step 5: 模範解答 (Model Answer)
その大学の入試で**満点が取れるレベル**の模範解答を作成してください。

# Output Format (JSON Only)
JSON Schema:
{
  "transcribed_text": "読み取った英文",
  "topic_recognition": "問題タイプの特定（例：自由英作文 - スマホの是非について）",
  "score": {
    "content": 0~10,
    "structure": 0~10,
    "vocabulary": 0~10,
    "grammar": 0~10,
    "total": 0~40
  },
  "is_passing_level": boolean,
  "corrections": [
    {
      "original": "修正前の箇所",
      "fixed": "修正後の表現",
      "type": "Grammar" | "Vocabulary" | "Structure" | "Content",
      "explanation": "なぜその表現が大学入試で不適切なのか、日本語で解説"
    }
  ],
  "advice": "合格に向けた具体的なアドバイス（例：『和文英訳では直訳しすぎず、英語らしい発想に転換しましょう』など）",
  "model_answer": "模範解答"
}
`;
            // Call Gemini Logic (Shared logic below)
            return await generateGeminiResponse(prompt, images);
        }

        // ---------------------------------------------------------
        // B. EIKEN EXAM LOGIC (Default)
        // ---------------------------------------------------------
        const eikenLevelStr = EikenLevelsMap[level || "2"] || `${level}級`; // Default to 2 if missing

        // 3. Prepare Level-Specific Advice
        let levelSpecificInstruction = "";
        if (["3", "pre-2"].includes(level || "")) {
            levelSpecificInstruction = "難しい単語を使うことよりも、基本的な文法ミスをなくすことを重視して採点してください。";
        } else if (["pre-1", "1"].includes(level || "")) {
            levelSpecificInstruction = "単調な表現を避け、高度な語彙や多様な構文が使われているかを厳しく評価してください。";
        }

        // 4. Prepare Image Description for Prompt
        let inputDataDescription = "";
        if (images.length === 2) {
            inputDataDescription = `
2枚の画像が提供されます：
1. **問題文**: TOPIC（テーマ）やPOINTS（観点）が書かれています。
2. **解答**: 受験者が手書きで書いた英作文です。
            `;
        } else {
            inputDataDescription = `
1枚の画像が提供されます：
1. **解答**: 受験者が手書きで書いた英作文です。（問題文の画像はありませんが、解答から内容を推測して採点してください）
            `;
        }

        // 5. Construct System Prompt based on Problem Type
        let systemInstruction = "";
        let criteriaSection = "";

        if (problemType === "summary") {
            // ■要約問題 (Summary)
            systemInstruction = `
あなたは英検（実用英語技能検定）${eikenLevelStr}の採点官です。要約問題（Summary）の採点を行います。
特に「要約としての適切さ」を重視して採点してください。
${levelSpecificInstruction}
            `;
            criteriaSection = `
## Step 2: 採点 (Scoring) - 要約問題専用基準
英検要約問題の採点基準（各観点0-4点、合計16点満点）に基づき、厳しく採点してください。
- **内容 (Content)**: 元の文章の重要なポイント（Main Idea + Key Details）がすべて含まれているか。不要なディテールが省かれているか。
- **構成 (Structure)**: パラグラフの構成が論理的か。接続詞（However, Furthermore等）が効果的に使われているか。
- **語彙 (Vocabulary)**: 元の文章の単語をそのままコピーするのではなく、自分の言葉で適切に言い換え（Paraphrasing）ができているか。
- **文法 (Grammar)**: 文構造の正確さと多様性。語数制限（${level === "2" ? "45-55語" : level === "pre-1" ? "60-70語" : "指定された語数"}程度）を守れているか厳しくチェックしてください。※語数が著しく過不足している場合は減点対象です。
            `;
        } else if (problemType === "email") {
            // ■Eメール問題 (Email)
            systemInstruction = `
あなたは英検（実用英語技能検定）${eikenLevelStr}の採点官です。Eメールへの返信問題の採点を行います。
相手からのメールに適切に返信できているかを重視します。
${levelSpecificInstruction}
            `;
            criteriaSection = `
## Step 2: 採点 (Scoring) - Eメール問題専用基準
英検Eメール問題の採点基準（各観点0-4点、合計16点満点）に基づき、厳しく採点してください。
- **内容 (Content)**: 相手のメールにある質問（通常2つ程度）に対して、すべて明確に回答しているか。
- **構成 (Structure)**: Eメールのフォーマット（挨拶、本文、結び）が適切か。文のつながりが自然か。
- **語彙 (Vocabulary)**: メールとしてふさわしい表現や語彙が使われているか。
- **文法 (Grammar)**: 文法の正確さと多様性。
            `;
        } else {
            // ■意見論述 (Opinion - Default)
            if (level === "pre-2-plus") {
                systemInstruction = `
あなたは英検（実用英語技能検定）準2級プラスの採点官であり、生徒を合格に導くプロの英語教師です。
意見論述問題（Opinion Writing）の採点を行います。
特に準2級プラス特有の「論理構成」と「語数」を重視して採点してください。
                `;
                criteriaSection = `
## Step 2: 採点 (Scoring) - 準2級プラス専用基準
英検準2級プラスの採点基準（各観点0-4点、合計16点満点）に基づき、厳しく採点してください。
- **内容 (Content)**: 自分の意見と、それを支える2つの理由が明確に含まれているか。
- **構成 (Structure)**: 「意見」→「理由1」→「理由2」→「結論（省略可）」の流れがあるか。論理的なつながり（coherence）があるか。
- **語彙 (Vocabulary)**: 準2級よりも少し高度な語彙や、適切な接続詞（Because, Also, For example, Thereforeなど）が使われているか。
- **文法 (Grammar)**: 基本的な文法の正しさに加え、多様な文構造が使われているか。語数目安（50語〜60語）から大きく外れていないかチェックしてください。
                `;
            } else {
                systemInstruction = `
あなたは英検（実用英語技能検定）${eikenLevelStr}の採点官であり、生徒を合格に導くプロの英語教師です。
特に ${eikenLevelStr} のライティング採点基準（内容・構成・語彙・文法）を完全に熟知しています。
${levelSpecificInstruction}
            `;
                criteriaSection = `
## Step 2: 採点 (Scoring) - 意見論述基準
英検の採点基準（各観点0-4点、合計16点満点）に基づき、厳しく採点してください。
- **内容 (Content)**: 課題で求められている内容が含まれているか。意見と理由が明確か。
- **構成 (Structure)**: 英文の構成や流れが分かりやすく論理的か。接続詞が適切に使われているか。
- **語彙 (Vocabulary)**: 課題に相応しい語彙が正しく使われているか。
- **文法 (Grammar)**: 文構造のバリエーションや文法の正しさ。
                `;
            }
        }

        const prompt = `
# Role
${systemInstruction}

# Input Data
${inputDataDescription}

# Task
提供された画像を分析し、以下のステップで処理を行ってください。

## Step 1: 文字起こし (Transcription)
手書きの解答画像を読み取り、正確にテキスト化してください。
スペルミスがある場合も、修正せずにそのまま読み取ってください（後で指摘するため）。

${criteriaSection}

## Step 3: 添削 (Correction)
文法ミス、不自然なコロケーション、より洗練された表現への書き換えを提案してください。
修正箇所は、文全体ではなく「間違っている箇所のみ」を指摘してください。（例: "are becoming" -> "is becoming"）
なぜ間違っているのか、どうすれば良くなるのかの「解説」を日本語で添えてください。
${problemType === "summary" ? "※要約の場合、元の文章の丸写しになっていないか、言い換えの提案も含めてください。" : ""}

## Step 4: フィードバック (Feedback)
合否の目安（合格ラインに達しているか）と、全体的なアドバイスを記述してください。
教師として、モチベーションが上がるような励ましの言葉を含めてください。

## Step 5: 模範解答 (Model Answer)
今回の課題に対する、${eikenLevelStr} レベルとして満点の模範解答を作成してください。

# Output Format (JSON Only)
回答は**必ずJSON形式のみ**で出力してください。Markdownのコードブロックは不要です。
JSON以外の会話文（「はい、分かりました」など）は一切含めないでください。

JSON Schema:
{
  "transcribed_text": "読み取った英文",
  "topic_recognition": "画像から読み取ったTOPICの内容（空欄可）",
  "score": {
    "content": 0~4の整数,
    "structure": 0~4の整数,
    "vocabulary": 0~4の整数,
    "grammar": 0~4の整数,
    "total": 0~16の整数
  },
  "is_passing_level": boolean, // 合格圏内ならtrue
  "corrections": [
    {
      "original": "修正前の箇所",
      "fixed": "修正後の表現",
      "type": "Grammar" | "Vocabulary" | "Structure" | "Content",
      "explanation": "日本語での解説"
    }
  ],
  "advice": "全体的な日本語でのアドバイス",
  "model_answer": "生成した模範解答"
}
`;

        return await generateGeminiResponse(prompt, images);


        // Helper function to call Gemini and parse JSON
        async function generateGeminiResponse(prompt: string, images: string[]) {
            // 6. Call Gemini API with Retry Logic for JSON Parsing
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
                    // Send Prompt + Images
                    const generatedContent = await model.generateContent([prompt, ...imageParts]);
                    const responseText = generatedContent.response.text();

                    // 7. Clean and Parse Response
                    const cleanedJson = responseText.replace(/```json|```/g, "").trim();
                    const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
                    const jsonString = jsonMatch ? jsonMatch[0] : cleanedJson;

                    parsedResponse = JSON.parse(jsonString);

                    // If parsing success, break the loop
                    break;

                } catch (error: any) {
                    console.warn(`Gemini API/Parsing attempt ${attempt} failed:`, error.message);

                    // If we reached max attempts, strictly throw the error or return error response
                    if (attempt === maxAttempts) {
                        console.error("Max attempts reached for Gemini generation/parsing.");
                        throw new Error("Failed to generate valid analysis after multiple attempts.");
                    }

                    // Wait before retrying (backoff)
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }

            return NextResponse.json(parsedResponse);
        }



    } catch (error: any) {
        console.error("Analysis Error:", error);
        return NextResponse.json(
            {
                error: "Internal Server Error",
                message: `サーバー内部でエラーが発生しました。詳細: ${error.message || String(error)}`
            },
            { status: 500 }
        );
    }
}
