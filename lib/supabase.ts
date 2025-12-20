import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 遅延初期化用のクライアント変数
let _supabase: SupabaseClient | null = null

// EduLens共通クライアントを取得
// 環境変数は EDULENS 名を優先、後方互換性のため MISTAP 名もフォールバック
export function getSupabase(): SupabaseClient | null {
    if (_supabase) {
        return _supabase
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL
        || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_ANON_KEY
        || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase環境変数が設定されていません')
        return null
    }

    _supabase = createClient(supabaseUrl, supabaseAnonKey)
    return _supabase
}

// 後方互換性のため
export const supabase = typeof window !== 'undefined' ? getSupabase() : null
