import { createClient, SupabaseClient } from '@supabase/supabase-js'

// EduLensプロジェクト専用クライアント（ポモドーロ履歴用）
// 認証はtango-test-appを使用するが、データ保存はedulensプロジェクトを使用

let _edulensClient: SupabaseClient | null = null

export function getEduLensSupabase(): SupabaseClient | null {
    // サーバーサイドでは null を返す
    if (typeof window === 'undefined') {
        return null
    }

    if (_edulensClient) {
        return _edulensClient
    }

    // 環境変数名: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
    // （EDULENS名もフォールバックとしてサポート）
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        || process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        || process.env.NEXT_PUBLIC_EDULENS_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('EduLens Supabase環境変数が設定されていません')
        return null
    }

    // 認証なしのクライアント（RLSは無効化しているため）
    _edulensClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    })
    return _edulensClient
}

