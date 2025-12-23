-- =====================================================
-- Mistap グループ機能 マイグレーション
-- 作成日: 2024-12-24
-- =====================================================

-- グループテーブル
CREATE TABLE IF NOT EXISTS groups (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    invite_code TEXT NOT NULL UNIQUE,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- グループメンバーテーブル
CREATE TABLE IF NOT EXISTS group_members (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_groups_invite_code ON groups(invite_code);
CREATE INDEX IF NOT EXISTS idx_groups_owner_id ON groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);

-- 行レベルセキュリティ（RLS）有効化
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLSポリシー: groups テーブル
-- =====================================================

-- SELECT: 所属グループを閲覧可能
CREATE POLICY "groups_select_policy" ON groups
    FOR SELECT USING (
        owner_id = auth.uid() OR
        id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
    );

-- INSERT: 認証済みユーザーがグループ作成可能
CREATE POLICY "groups_insert_policy" ON groups
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- UPDATE: オーナーのみ更新可能
CREATE POLICY "groups_update_policy" ON groups
    FOR UPDATE USING (auth.uid() = owner_id);

-- DELETE: オーナーのみ削除可能
CREATE POLICY "groups_delete_policy" ON groups
    FOR DELETE USING (auth.uid() = owner_id);

-- =====================================================
-- RLSポリシー: group_members テーブル
-- =====================================================

-- SELECT: 同じグループのメンバーを閲覧可能
CREATE POLICY "group_members_select_policy" ON group_members
    FOR SELECT USING (
        group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
    );

-- INSERT: 自分自身を追加可能（グループ参加）
CREATE POLICY "group_members_insert_policy" ON group_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- DELETE: 自分自身を削除可能（グループ脱退）またはオーナーがメンバー削除可能
CREATE POLICY "group_members_delete_policy" ON group_members
    FOR DELETE USING (
        auth.uid() = user_id OR
        group_id IN (SELECT id FROM groups WHERE owner_id = auth.uid())
    );

-- =====================================================
-- 招待コード検索用の関数（未認証でもグループ名を取得可能にする）
-- =====================================================
CREATE OR REPLACE FUNCTION get_group_by_invite_code(code TEXT)
RETURNS TABLE (
    id BIGINT,
    name TEXT,
    owner_id UUID,
    created_at TIMESTAMPTZ
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT id, name, owner_id, created_at
    FROM groups
    WHERE invite_code = code
    LIMIT 1;
$$;
