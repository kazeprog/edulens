// 後方互換性のためのラッパー
// 新規コードは @/lib/supabase を直接使用してください
import { getSupabase } from '@/lib/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

// 遅延初期化でSupabaseクライアントを取得
// nullの場合はダミークライアントを返すことでクラッシュを防ぐ
const client = getSupabase()

if (!client) {
  console.warn('Supabaseクライアントが初期化できませんでした')
}

export const supabase = client as SupabaseClient