-- =====================================================
-- ランキング用テストカウント取得関数（修正版）
-- profiles.test_count を使用して正確なテスト回数を取得
-- 作成日: 2024-12-24
-- =====================================================

-- 古い関数を削除
DROP FUNCTION IF EXISTS get_group_member_test_counts(BIGINT);
DROP FUNCTION IF EXISTS get_multiple_groups_member_test_counts(BIGINT[]);

-- グループメンバーのテスト回数を取得する関数（profiles.test_count使用）
CREATE OR REPLACE FUNCTION get_group_member_test_counts(group_id_param BIGINT)
RETURNS TABLE (
    user_id UUID,
    test_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT 
        gm.user_id,
        COALESCE(p.test_count, 0)::BIGINT as test_count
    FROM group_members gm
    LEFT JOIN profiles p ON p.id = gm.user_id
    WHERE gm.group_id = group_id_param;
$$;

-- 複数グループのメンバーのテスト回数を取得する関数（profiles.test_count使用）
CREATE OR REPLACE FUNCTION get_multiple_groups_member_test_counts(group_ids BIGINT[])
RETURNS TABLE (
    user_id UUID,
    test_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT DISTINCT ON (gm.user_id)
        gm.user_id,
        COALESCE(p.test_count, 0)::BIGINT as test_count
    FROM group_members gm
    LEFT JOIN profiles p ON p.id = gm.user_id
    WHERE gm.group_id = ANY(group_ids);
$$;
