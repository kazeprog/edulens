import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import * as cheerio from 'cheerio';

// HTMLからテキストを抽出
function extractTextFromHTML(html: string): string {
    const $ = cheerio.load(html);
    // スクリプトとスタイルを除去
    $('script, style, nav, header, footer').remove();
    // メインコンテンツのテキストを取得
    return $('body').text().replace(/\s+/g, ' ').trim();
}

// 都道府県リスト（IDとのマッピング用）
const prefectureMap: { [key: string]: number } = {
    '北海道': 1, '青森県': 2, '岩手県': 3, '宮城県': 4, '秋田県': 5,
    '山形県': 6, '福島県': 7, '茨城県': 8, '栃木県': 9, '群馬県': 10,
    '埼玉県': 11, '千葉県': 12, '東京都': 13, '神奈川県': 14, '新潟県': 15,
    '富山県': 16, '石川県': 17, '福井県': 18, '山梨県': 19, '長野県': 20,
    '岐阜県': 21, '静岡県': 22, '愛知県': 23, '三重県': 24, '滋賀県': 25,
    '京都府': 26, '大阪府': 27, '兵庫県': 28, '奈良県': 29, '和歌山県': 30,
    '鳥取県': 31, '島根県': 32, '岡山県': 33, '広島県': 34, '山口県': 35,
    '徳島県': 36, '香川県': 37, '愛媛県': 38, '高知県': 39, '福岡県': 40,
    '佐賀県': 41, '長崎県': 42, '熊本県': 43, '大分県': 44, '宮崎県': 45,
    '鹿児島県': 46, '沖縄県': 47
};

const PROMPT = `以下は公立高校入試日程に関する情報です。
この情報から、都道府県名、年度、試験日程を読み取り、以下のJSON形式でデータを抽出してください。

出力形式（厳密にこの形式で出力してください）:
{
  "prefecture": "都道府県名（例: 兵庫県）",
  "year": 西暦年度（数値、例: 2027）,
  "exams": [
    {
      "category": "public_general または public_recommendation",
      "name": "試験名（例: 一般入学者選抜）",
      "date": "YYYY-MM-DD形式の試験日",
      "result_date": "YYYY-MM-DD形式の合格発表日（不明な場合はnull）",
      "application_start": "YYYY-MM-DD形式の出願開始日（不明な場合はnull）",
      "application_end": "YYYY-MM-DD形式の出願締切日（不明な場合はnull）"
    }
  ]
}

重要な注意:
- 令和9年度 = 2027年、令和8年度 = 2026年、令和7年度 = 2025年 として変換してください
- 都道府県名はURLやコンテンツから判断してください（例: hyogo → 兵庫県、tokyo → 東京都）
- categoryは「一般」「学力検査」等は "public_general"、「推薦」「特色」「前期」等は "public_recommendation" としてください
- 日付は必ずYYYY-MM-DD形式で出力してください
- 試験が複数ある場合はすべて抽出してください`;

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const isPDF = url.toLowerCase().endsWith('.pdf');
        let responseText: string;

        if (isPDF) {
            // PDFの場合: ファイルをダウンロードしてbase64でGeminiに送信
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const base64Data = Buffer.from(arrayBuffer).toString('base64');

            const result = await model.generateContent([
                {
                    inlineData: {
                        mimeType: 'application/pdf',
                        data: base64Data
                    }
                },
                { text: `URL: ${url}\n\n${PROMPT}` }
            ]);

            responseText = result.response.text();
        } else {
            // HTMLの場合: テキストを抽出してGeminiに送信
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
            }

            const html = await response.text();
            const text = extractTextFromHTML(html);

            if (!text || text.length < 50) {
                return NextResponse.json({ error: 'Could not extract enough text from the URL' }, { status: 400 });
            }

            const result = await model.generateContent(`URL: ${url}\n\n${PROMPT}\n\n抽出元テキスト:\n${text.substring(0, 8000)}`);
            responseText = result.response.text();
        }

        // JSONをパース
        let parsedData;
        try {
            parsedData = JSON.parse(responseText);
        } catch {
            return NextResponse.json({
                error: 'Failed to parse AI response',
                raw: responseText
            }, { status: 500 });
        }

        // 都道府県IDを追加
        const prefectureId = prefectureMap[parsedData.prefecture] || null;

        return NextResponse.json({
            success: true,
            contentType: isPDF ? 'pdf' : 'html',
            data: {
                ...parsedData,
                prefecture_id: prefectureId
            }
        });

    } catch (error) {
        console.error('Import exam error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
