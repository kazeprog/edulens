// 後方互換性のためのラッパー
// 新規コードは @/lib/supabase を直接使用してください
import { getSupabase } from '@/lib/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

// クライアントサイドでのみ動作するプロキシオブジェクトを作成
// これにより、実際のAPI呼び出し時に毎回 getSupabase() から最新のクライアントを取得する
const createSupabaseProxy = (): SupabaseClient => {
  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      const client = getSupabase()
      if (!client) {
        // クライアントサイドでない場合やエラーの場合
        console.warn('Supabaseクライアントが利用できません')
        // 基本的なAPIの形式を返す（エラーを防ぐ）
        if (prop === 'auth') {
          return {
            getUser: async () => ({ data: { user: null }, error: new Error('Supabase not initialized') }),
            getSession: async () => ({ data: { session: null }, error: new Error('Supabase not initialized') }),
            signOut: async () => ({ error: null }),
            signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not initialized') }),
            signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not initialized') }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
          }
        }
        if (prop === 'from') {
          return () => ({
            select: () => ({ eq: () => ({ single: async () => ({ data: null, error: new Error('Supabase not initialized') }) }) }),
            insert: async () => ({ data: null, error: new Error('Supabase not initialized') }),
            upsert: async () => ({ data: null, error: new Error('Supabase not initialized') }),
          })
        }
        return undefined
      }
      return (client as unknown as Record<string, unknown>)[prop as string]
    }
  }
  return new Proxy({}, handler) as SupabaseClient
}

export const supabase = createSupabaseProxy()