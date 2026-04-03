import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerGeminiModelSettings } from '@/lib/server-gemini-model-config';

const apiKeys = [
    process.env.GOOGLE_GEMINI_API_KEY,
    process.env.GOOGLE_GEMINI_API_KEY_2,
].filter((key): key is string => !!key);

export async function POST(request: NextRequest) {
    try {
        const { prefecture, year } = await request.json();
        const geminiSettings = await getServerGeminiModelSettings();
        const searchModel = geminiSettings.gemini_model_admin_search;

        if (!prefecture || !year) {
            return NextResponse.json({ error: '都道府県と年度は必須です。' }, { status: 400 });
        }

        const query = `${prefecture} 公立高校入試 日程 ${year}年度`;

        let result: string | null = null;
        let lastError: unknown = null;

        for (const apiKey of apiKeys) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: searchModel,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    tools: [{ googleSearch: {} } as any],
                });

                const prompt = `
次の検索語に対応する「公立高校入試の日程」が載っている公的な URL を探してください: "${query}"

検索結果から、なるべく公式または公的機関のページだけを選んでください。
PDF も可です。
返答は JSON のみで、次の形式にしてください。

\`\`\`json
{
  "urls": [
    {
      "title": "ページタイトル",
      "url": "https://example.com",
      "description": "その URL が入試日程ページだと分かる短い説明"
    }
  ]
}
\`\`\`
`;

                const generationResult = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                });

                const text = generationResult.response.text();
                const match = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
                result = (match ? match[1] : text).replace(/^```json/, '').replace(/```$/, '').trim();
                break;
            } catch (error) {
                console.error('Gemini Search API Error:', error);
                lastError = error;
            }
        }

        if (!result) {
            throw lastError || new Error('All API keys failed');
        }

        return NextResponse.json(JSON.parse(result));
    } catch (error) {
        console.error('Search exam url error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 },
        );
    }
}
