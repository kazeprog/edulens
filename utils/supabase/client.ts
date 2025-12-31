/**
 * Supabase Client for Countdown features
 * 
 * This module re-exports the central Supabase client from lib/supabase.ts
 * to ensure all features use the consolidated tango-test-app project.
 * 
 * NOTE: This client works on BOTH server and client side.
 * For server-side rendering (like generateMetadata), we create a fresh client.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// サーバーサイドでも動作するクライアントを作成
function createSupabaseClient(): SupabaseClient {
  // tango-test-app プロジェクトの環境変数を使用
  // EDULENS を優先、MISTAP をフォールバック
  const supabaseUrl = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL
    || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL
    || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_ANON_KEY
    || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_ANON_KEY
    || ''

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables: NEXT_PUBLIC_EDULENS_SUPABASE_URL or NEXT_PUBLIC_EDULENS_SUPABASE_ANON_KEY')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// シングルトンクライアント (サーバー・クライアント両方で動作)
export const supabase = createSupabaseClient()
