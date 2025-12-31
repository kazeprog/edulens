-- ==========================================
-- 0. 再帰防止のための関数定義 (重要)
-- ==========================================
-- RLSポリシー内で profiles テーブルを参照すると無限ループになるため、
-- セキュリティ定義者(SECURITY DEFINER)の権限で実行される関数経由で role をチェックします。

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 1. 指定ユーザーを管理者に設定
-- ==========================================
UPDATE profiles
SET role = 'admin'
WHERE id = 'dfd7f9a8-4604-4327-856b-80f08fb26d49';

-- ==========================================
-- 2. お知らせ (announcements) の権限設定
-- ==========================================
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;

CREATE POLICY "Admins can manage announcements"
ON announcements
FOR ALL
USING ( is_admin() );

-- ==========================================
-- 3. 試験日程 (exam_schedules) の権限設定
-- ==========================================
ALTER TABLE exam_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read exam_schedules" ON exam_schedules;
DROP POLICY IF EXISTS "Admins can manage exam_schedules" ON exam_schedules;
DROP POLICY IF EXISTS "Public read access for exam_schedules" ON exam_schedules;

CREATE POLICY "Anyone can read exam_schedules"
ON exam_schedules
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage exam_schedules"
ON exam_schedules
FOR ALL
USING ( is_admin() );

-- ==========================================
-- 4. テスト結果 (results) の権限設定
-- ==========================================
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all results" ON results;
DROP POLICY IF EXISTS "Users can view own results" ON results;

-- 管理者はすべてのテスト結果を閲覧可能
CREATE POLICY "Admins can view all results"
ON results
FOR SELECT
USING ( is_admin() );

-- ユーザーは自分のテスト結果を閲覧可能
CREATE POLICY "Users can view own results"
ON results
FOR SELECT
USING ( auth.uid() = user_id );

-- ==========================================
-- 5. プロファイル (profiles) の権限設定
-- ==========================================
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- ユーザーは自分のプロファイルを見れる
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
USING ( auth.uid() = id );

-- 管理者はすべてのプロファイルを見れる (関数を使用することで無限ループを回避)
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
USING ( is_admin() );
