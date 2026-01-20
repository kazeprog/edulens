import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini APIキーのリスト（ローテーション用）
const apiKeys = [
    process.env.GOOGLE_GEMINI_API_KEY,
    process.env.GOOGLE_GEMINI_API_KEY_2
].filter((key): key is string => !!key);

export async function POST(request: NextRequest) {
    try {
        const { prefecture, year } = await request.json();

        if (!prefecture || !year) {
            return NextResponse.json({ error: '都道府県と年度が必要です' }, { status: 400 });
        }

        // 検索クエリの構築
        const query = `${prefecture} 公立高校入試日程 ${year}年度`;

        let result = null;
        let lastError = null;

        // キーローテーションで試行
        for (const apiKey of apiKeys) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: 'gemini-2.0-flash',
                    tools: [{ googleSearch: {} } as any] // Google検索ツールを使用
                });

                const prompt = `
以下の検索を行ってください: "${query}"

検索結果から、**公立高校入試の日程（選抜要項、実施要項など）が詳しく記載されている公式のURL**を探してください。
特にPDFファイル（募集要項のPDFなど）が最適です。
上位3つのURLを以下のJSON形式で出力してください。

出力形式:
\`\`\`json
{
  "urls": [
    {
      "title": "ページのタイトル",
      "url": "URL",
      "description": "簡単な説明（PDFかどうかも記述）"
    }
  ]
}
\`\`\`
必ずJSON形式のみを出力してください。
`;

                const generationResult = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    // Search toolとJSON modeは併用できないため削除
                    // generationConfig: { responseMimeType: 'application/json' }
                });

                const text = generationResult.response.text();

                // JSONブロックを抽出
                const match = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
                result = match ? match[1] : text;

                // クリーンアップ
                result = result.replace(/^```json/, '').replace(/```$/, '').trim();

                break; // 成功したらループを抜ける
            } catch (error) {
                console.error('Gemini Search API Error:', error);
                lastError = error;
                // 次のキーへ
            }
        }

        if (!result) {
            throw lastError || new Error('All API keys failed');
        }

        return NextResponse.json(JSON.parse(result));

    } catch (error) {
        console.error('Search exam url error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
