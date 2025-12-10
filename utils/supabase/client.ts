import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  // 開発環境などで環境変数が未設定の場合、モジュール評価時に例外を投げると
  // Next のメタデータ生成や静的レンダリングでクラッシュするため、ここでは警告を出すに留めます。
  // 実際に Supabase を使用する処理（クエリ送信など）は、呼び出し時に環境変数をチェックしてください。
  // 例：`if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error(...)`
  // 開発中は .env.local に環境変数を追加してください。
  // https://supabase.com/docs/guides/with-nextjs
  // eslint-disable-next-line no-console
  console.warn('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
