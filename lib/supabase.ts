import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 遅延初期化用のクライアント変数
let _supabase: SupabaseClient | null = null

// EduLens共通クライアントを取得
// 環境変数は EDULENS 名を優先、後方互換性のため MISTAP 名もフォールバック
export function getSupabase(): SupabaseClient | null {
    // サーバーサイドでは null を返す（クライアントサイドでのみ使用）
    if (typeof window === 'undefined') {
        return null
    }

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

    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    })
    return _supabase
}

// 後方互換性のため（クライアントサイドでのみ初期化）
export const supabase = typeof window !== 'undefined' ? getSupabase() : null

// サーバーサイド用Supabaseクライアント（API Routes, Server Actions用）
export function getServerSupabase(): SupabaseClient | null {
    const supabaseUrl = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL
        || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_ANON_KEY
        || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase環境変数が設定されていません（サーバー）')
        return null
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    })
}

// Admin用Supabaseクライアント（ユーザー作成などの管理操作用）
// 注意: SUPABASE_SERVICE_ROLE_KEY は絶対にクライアントに公開しないこと
export function getAdminSupabase(): SupabaseClient | null {
    const supabaseUrl = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL
        || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
        console.warn('Admin用Supabase環境変数が設定されていません')
        return null
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    })
}
