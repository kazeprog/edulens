-- =====================================================
-- RLSポリシー修正: 無限再帰を解消
-- 作成日: 2024-12-24
-- =====================================================

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "group_members_select_policy" ON group_members;
DROP POLICY IF EXISTS "groups_select_policy" ON groups;

-- =====================================================
-- 修正版RLSポリシー: group_members テーブル
-- =====================================================

-- SELECT: 自分のメンバーシップは常に閲覧可能（シンプルに）
CREATE POLICY "group_members_select_own" ON group_members
    FOR SELECT USING (auth.uid() = user_id);

-- SELECT: 同じグループのメンバーも閲覧可能（SECURITY DEFINERで回避）
-- まず関数を作成
CREATE OR REPLACE FUNCTION user_is_group_member(check_group_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM group_members 
        WHERE group_id = check_group_id 
        AND user_id = auth.uid()
    );
$$;

-- グループメンバーを閲覧可能（別ポリシーとして追加）
CREATE POLICY "group_members_select_same_group" ON group_members
    FOR SELECT USING (user_is_group_member(group_id));

-- =====================================================
-- 修正版RLSポリシー: groups テーブル
-- =====================================================

-- オーナーまたはメンバーが閲覧可能
CREATE POLICY "groups_select_policy" ON groups
    FOR SELECT USING (
        owner_id = auth.uid() OR
        user_is_group_member(id)
    );
