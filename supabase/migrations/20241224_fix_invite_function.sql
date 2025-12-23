-- =====================================================
-- 招待コード検索関数の修正: invite_codeを返すように変更
-- 作成日: 2024-12-24
-- =====================================================

-- 既存の関数を削除して再作成
DROP FUNCTION IF EXISTS get_group_by_invite_code(TEXT);

-- 招待コード検索用の関数（invite_codeを含めて返す）
CREATE OR REPLACE FUNCTION get_group_by_invite_code(code TEXT)
RETURNS TABLE (
    id BIGINT,
    name TEXT,
    invite_code TEXT,
    owner_id UUID,
    created_at TIMESTAMPTZ
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT id, name, invite_code, owner_id, created_at
    FROM groups
    WHERE groups.invite_code = code
    LIMIT 1;
$$;
