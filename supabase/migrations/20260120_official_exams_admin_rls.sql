-- ==========================================
-- official_exams テーブルに管理者用RLSポリシーを追加
-- role = 'admin' のユーザーのみ INSERT/UPDATE/DELETE 可能
-- ==========================================

-- 既存ポリシーがあれば削除（冪等性のため）
DROP POLICY IF EXISTS "Admin can insert official_exams" ON official_exams;
DROP POLICY IF EXISTS "Admin can update official_exams" ON official_exams;
DROP POLICY IF EXISTS "Admin can delete official_exams" ON official_exams;

-- INSERT ポリシー
CREATE POLICY "Admin can insert official_exams" 
ON official_exams FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- UPDATE ポリシー
CREATE POLICY "Admin can update official_exams" 
ON official_exams FOR UPDATE 
TO authenticated 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- DELETE ポリシー
CREATE POLICY "Admin can delete official_exams" 
ON official_exams FOR DELETE 
TO authenticated 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
