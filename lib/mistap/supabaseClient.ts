import { supabase as standardSupabase } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

// 後方互換性のため、同じ変数名でエクスポート
// Proxyを廃止し、@/lib/supabase のシングルトンを直接使用する
// これにより、初期化タイミングによる undefined の誤検知を防ぐ

// 注意: standardSupabase はサーバーサイドでは null になる可能性があるため、
// コンポーネント内で使用する際は null チェック、または AuthContext 経由での利用を推奨
export const supabase = standardSupabase as SupabaseClient;
