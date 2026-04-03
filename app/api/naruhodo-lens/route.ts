import { streamText, convertToModelMessages } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { NextRequest } from 'next/server';
import { Buffer } from 'buffer';

// Initialize Google AI with existing API key
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

// System prompt for NaruhodoLens
const SYSTEM_PROMPT = `# あなたの役割
あなたは学習支援AI「ナルホドレンズ」です。
親しみやすい先輩のような口調（「〜だよ」「〜だね」「〜かな？」）で、生徒が理解できるまで丁寧に教えます。

# 出力形式の絶対ルール（厳守）
1. マークダウン記法は一切禁止：
   - 太字（**）、見出し（#）、箇条書き（-）などの記号は絶対に使わないでください。
   - 文構造は「改行」と「空行」だけで表現してください。
2. 数式の表記：
   - 数式は必ずLaTeX形式で出力してください。
   - インライン数式は $...$ で囲み、独立した数式は $$...$$ で囲んでください。
3. 学年基準：
   - 日本の教科書基準に従ってください。
4. 数式表記の指定（厳守）：
   - 一次関数: $y = ax + b$（傾き $a$、切片 $b$）※ $y = mx + n$ ではない
   - 二次関数: $y = ax^2 + bx + c$
   - 比例: $y = ax$

# 進行フロー（ロジック）

## Phase 1: 画像認識と学年確認
画像認識後、まだ学年が不明なら必ず確認してください。
「問題を受け取ったよ！解説する前に、今の学年を教えてくれるかな？」

## Phase 1.5: 解説画像の分析（重要）
アップロードされた画像の中に「解説」や「答え」の画像が含まれているか確認してください。
- **解説画像がある場合**:
  その解説画像で使われている解法（公式の選び方、補助線の引き方、考え方の順序など）を分析し、**必ずその解法に沿って解説してください**。
  「送ってくれた解説の通りに説明するね！」と一言添えてください。
  ※もし解説画像の解法がユーザーの学年範囲外の場合は、その旨を指摘しつつ、学年相応の解法を提案してください。

## Phase 2: 小問の構成確認（重要）
画像内に (1), (2), (3)... のように複数の小問があるか確認してください。
**複数の小問がある場合、絶対にまとめて解説しないでください。**
必ず「まずは(1)から解説するね！」と宣言し、(1)だけに集中してください。

## Phase 3: ステップ・バイ・ステップ対話
現在解説中の小問（例：(1)）について、さらに3〜5つのステップに分解して解説します。

### ステップ進行のルール
1. **宣言**:
   新しい小問に入るときは「まずは(1)を3つのステップで解説するね！」のように全体の流れを伝えてください。
2. **1ステップずつ**:
   「ステップ1：〇〇」の内容だけを出力し、必ず「ここまで大丈夫？」と質問して停止してください。
   ※解説の最後を「〜できるかな？」のように無理やり疑問形にする必要はありません。「〜になるよ」「〜だね」と言い切ってから、改行して「ここまで大丈夫？」と続けてください。
3. **小問の完了**:
   その小問の最後のステップが終わっても、「次は(2)に進んでもいいかな？」とは言わずに、**必ず「ここまで大丈夫？」で終了してください**。
   ユーザーが「はい」と答えたら、次の小問に進み、「次は(2)だね！」と切り出してください。

**重要：いかなる状況でも、ユーザーへの質問は「ここまで大丈夫？」で統一してください。**

## Phase 4: ユーザー反応への対応
- 「はい」→ 次のステップ、または次の小問へ進む。
- 「いいえ」→ 現在のステップを噛み砕いて再説明する。
- **【重要】ユーザーから「いいえ」（または否定的な反応）が3回連続で返された場合は、「ごめん、僕の説明だとこれが限界かも💦 先生に直接聞いてみてね！ [END]」と正直に伝えて解説を終了してください。**

# 出力例（複数小問がある場合）

[学年確認後]
中2だね、ありがとう！
この画像には(1)から(3)まで問題があるね。
いっきにやると大変だから、ひとつずつ順番にやっていこう！

まずは(1)を、3つのステップで解説するね。
これは一次関数の式を求める問題だよ。

ステップ1：変化の割合を求めよう

グラフを見ると、xが1増えるとyが2増えているのがわかるかな？
これが変化の割合（傾き）になるんだ。

ここまで大丈夫？
`;

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { redis } from '@/lib/redis';
import {
    GEMINI_MODEL_CONFIG_KEYS,
    getDefaultGeminiModelSettings,
    resolveGeminiModelSettings,
} from '@/lib/gemini-model-config';
import { Ratelimit } from '@upstash/ratelimit';
import { cookies } from 'next/headers';
// ... needed imports

export async function POST(req: NextRequest) {
    try {
        const json = await req.json();
        const { messages, token: bodyToken } = json;

        // Get token from Authorization header or body
        const authHeader = req.headers.get('Authorization');
        const headerToken = authHeader?.replace('Bearer ', '');
        const token = headerToken || bodyToken || null;

        // Validate messages
        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: 'Messages are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // --- Security & Burst Protection ---

        // 1. Basic Bot Detection using User-Agent
        const userAgent = req.headers.get('user-agent') || '';
        if (!userAgent || userAgent.match(/bot|crawler|spider|curl|wget|python-requests/i)) {
            return new Response(JSON.stringify({ error: 'Access Denied' }), { status: 403 });
        }

        // 2. Burst Rate Limiting (IP based) - Prevent DDoS/Spam
        // Limit to 10 requests per minute per IP (regardless of user status)
        const ipForBurst = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown_ip';
        const burstLimit = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests / 1 min
            prefix: 'naruhodo_burst',
            analytics: false,
        });

        const { success: burstSuccess } = await burstLimit.limit(ipForBurst);
        if (!burstSuccess) {
            return new Response(JSON.stringify({ error: 'Too Many Requests (Burst Limit)' }), { status: 429 });
        }

        // --- Data Preparation ---

        // Check if the latest message has images (Count usage only for image uploads)
        const lastMessage = messages[messages.length - 1];
        const lastMessageRecord = typeof lastMessage === 'object' && lastMessage !== null
            ? lastMessage as Record<string, unknown>
            : {};
        const messageParts = Array.isArray(lastMessageRecord.parts)
            ? lastMessageRecord.parts.filter((part): part is Record<string, unknown> => typeof part === 'object' && part !== null)
            : [];
        const messageContent = Array.isArray(lastMessageRecord.content)
            ? lastMessageRecord.content.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
            : [];

        // Robust Check for Images (Attachment or Multimodal Content)
        let hasImage = Array.isArray(lastMessageRecord.experimental_attachments) && lastMessageRecord.experimental_attachments.length > 0;

        // Also check "parts" array which is used by Vercel AI SDK v6
        if (!hasImage) {
            hasImage = messageParts.some((part) =>
                part.type === 'file' || part.type === 'image'
            );
        }

        if (!hasImage) {
            hasImage = messageContent.some((item) =>
                item.type === 'image' || (typeof item.mimeType === 'string' && item.mimeType.startsWith('image/')) || Boolean(item.image)
            );
        }

        // --- User Identification (Early Resolution) ---
        let userId: string | null = null;
        let userName: string | null = null;
        let isPro = false;
        const supabase = createServerSupabaseClient();

        // Create Admin Client for fetching profile (Bypass RLS)
        const supabaseUrl = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.MISTAP_SUPABASE_SERVICE_ROLE_KEY;

        // Fallback to anonymous client if service key is missing (though profile fetch might fail)
        const adminClient = (supabaseUrl && supabaseServiceKey)
            ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
            : supabase;

        let primaryModel = getDefaultGeminiModelSettings().gemini_model_naruhodo_primary;
        let fallbackModel = getDefaultGeminiModelSettings().gemini_model_naruhodo_fallback;
        try {
            const { data: geminiConfigRows } = await adminClient
                .from('app_config')
                .select('key, value')
                .in('key', GEMINI_MODEL_CONFIG_KEYS);

            const geminiSettings = resolveGeminiModelSettings(geminiConfigRows);
            primaryModel = geminiSettings.gemini_model_naruhodo_primary;
            fallbackModel = geminiSettings.gemini_model_naruhodo_fallback;
        } catch (configError) {
            console.warn('Failed to load Gemini model config for Naruhodo Lens. Using default models.', configError);
        }

        if (token) {
            const { data: { user } } = await supabase.auth.getUser(token);
            if (user) {
                userId = user.id;
                // Check Pro status & Get Name using Admin Client
                const { data: profile } = await adminClient
                    .from('profiles')
                    .select('is_pro, full_name')
                    .eq('id', userId)
                    .single();

                isPro = !!profile?.is_pro;
                userName = profile?.full_name ?? null;
            }
        }

        // Guest ID Logic
        const cookieStore = await cookies();
        let guestId = cookieStore.get('naruhodo_guest_id')?.value;
        let shouldSetGuestCookie = false;
        let newGuestId = '';

        if (!guestId) {
            guestId = crypto.randomUUID();
            shouldSetGuestCookie = true;
            newGuestId = guestId;
        } else {
            newGuestId = guestId; // keep existing
        }

        // Anonymize IP for logging
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
        const ipHash = ip !== 'unknown' ? Buffer.from(ip).toString('base64') : null;

        // --- Usage Limit Logic (Upstash Redis) ---
        // Only enforce limit if image is attached
        let success = true;

        if (hasImage) {
            if (userId) {
                let ratelimit: Ratelimit;
                if (isPro) {
                    // Pro User: 20 req / 24h
                    ratelimit = new Ratelimit({
                        redis,
                        limiter: Ratelimit.slidingWindow(20, '24 h'),
                        prefix: 'naruhodo_pro',
                        analytics: true,
                    });
                } else {
                    // Free User: 2 req / 24h
                    ratelimit = new Ratelimit({
                        redis,
                        limiter: Ratelimit.slidingWindow(2, '24 h'),
                        prefix: 'naruhodo_free',
                        analytics: true,
                    });
                }
                const result = await ratelimit.limit(userId);
                success = result.success;

            } else {
                // Guest User: 1 req / 24h (Cookie AND IP Hybrid Limit)
                const currentGuestId = guestId || newGuestId; // Use resolved guestId

                const ratelimitCookie = new Ratelimit({
                    redis,
                    limiter: Ratelimit.slidingWindow(1, '24 h'),
                    prefix: 'naruhodo_guest_cookie',
                    analytics: true,
                });

                const ratelimitIP = new Ratelimit({
                    redis,
                    limiter: Ratelimit.slidingWindow(1, '24 h'),
                    prefix: 'naruhodo_guest_ip',
                    analytics: true,
                });

                // Check BOTH. If EITHER is exceeded, block.
                const [cookieResult, ipResult] = await Promise.all([
                    ratelimitCookie.limit(currentGuestId),
                    ratelimitIP.limit(ip)
                ]);

                success = cookieResult.success && ipResult.success;
            }
        }

        // Handle Limit Exceeded
        if (!success) {
            let limitMessage: string;
            let upgradeUrl: string | null = null;

            if (userId && !isPro) {
                // Free User
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mistap.jp';
                upgradeUrl = `${baseUrl}/upgrade?source=naruhodo`;
                limitMessage = `今日の無料回数はおしまいだよ！Proアカウントに変更で1日20問まで質問できるよ！\n\n👉 Proプランはこちら: ${upgradeUrl}`;
            } else if (isPro) {
                // Pro User
                limitMessage = "今日の質問回数はおしまいだよ！また明日質問してね！";
            } else {
                // Guest User
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mistap.jp';
                const loginUrl = `${baseUrl}/login?mode=signup&redirect=%2Fnaruhodo-lens`;
                limitMessage = `今日の無料回数はおしまいだよ！ログインすると1日2回まで質問できるよ！\n\n👉 [今すぐ新規登録](${loginUrl})`;
            }

            const result = streamText({
                model: google(primaryModel),
                system: `あなたは学習支援AI「ナルホドレンズ」です。ユーザーに対して「${limitMessage}」とだけ伝えてください。親しみやすい口調で、それ以外のことは絶対に話さないでください。URLはそのまま表示してください。`,
                messages: [
                    { role: 'user', content: 'limit check' }
                ],
            });

            const response = result.toUIMessageStreamResponse();
            if (shouldSetGuestCookie) {
                response.headers.set('Set-Cookie', `naruhodo_guest_id=${newGuestId}; Path=/; Max-Age=31536000; SameSite=Lax`);
            }
            return response;
        }

        // --- Generate Response ---

        // Pre-convert messages once to reuse
        const coreMessages = await convertToModelMessages(messages);

        // Define logging callback
        // Logging: Execute synchronously before streaming to ensure persistence
        // Only log if an image is attached (User requirement: Count "image explanation" sessions, not chat turns)
        if (hasImage) {
            try {
                // Use adminClient (or recreate if scope issue) for logging to ensure insert permissions
                const supabaseUrl = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL;
                const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.MISTAP_SUPABASE_SERVICE_ROLE_KEY;
                const logger = (supabaseUrl && supabaseServiceKey)
                    ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
                    : createServerSupabaseClient();

                await logger.from('naruhodo_usage_logs').insert({
                    user_id: userId,
                    guest_id: userId ? null : (guestId || newGuestId),
                    has_image: hasImage,
                    is_pro: isPro,
                    user_name: userName,
                    user_agent: userAgent,
                    ip_hash: ipHash
                });
            } catch (err) {
                console.error('Failed to log Naruhodo usage:', err);
            }
        }

        let result;

        try {
            // Attempt 1: Configured primary model
            result = streamText({
                model: google(primaryModel),
                system: SYSTEM_PROMPT,
                messages: coreMessages,
                maxRetries: 5,
            });
        } catch (error) {
            console.warn('Primary model failed. Switching to fallback.', error);

            // Attempt 2: Fallback Model
            result = streamText({
                model: google(fallbackModel),
                system: SYSTEM_PROMPT,
                messages: coreMessages,
            });
        }

        const response = result.toUIMessageStreamResponse();
        if (shouldSetGuestCookie) {
            response.headers.set('Set-Cookie', `naruhodo_guest_id=${newGuestId}; Path=/; Max-Age=31536000; SameSite=Lax`);
        }
        return response;

    } catch (error: unknown) {
        console.error('NaruhodoLens API Error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({
                error: 'Internal Server Error',
                message: errorMessage
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
