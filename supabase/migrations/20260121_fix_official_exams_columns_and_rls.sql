-- カラムの追加（存在しない場合のみ）
ALTER TABLE official_exams ADD COLUMN IF NOT EXISTS application_start DATE;
ALTER TABLE official_exams ADD COLUMN IF NOT EXISTS application_end DATE;

-- RLSポリシー再設定（既存のものを削除して再作成）
DROP POLICY IF EXISTS "Enable insert for authenticated users with role admin" ON official_exams;
DROP POLICY IF EXISTS "Enable update for authenticated users with role admin" ON official_exams;
DROP POLICY IF EXISTS "Enable delete for authenticated users with role admin" ON official_exams;

-- 短い名前で作成された可能性もあるため削除
DROP POLICY IF EXISTS "Enable insert for admin" ON official_exams;
DROP POLICY IF EXISTS "Enable update for admin" ON official_exams;
DROP POLICY IF EXISTS "Enable delete for admin" ON official_exams;

-- ポリシーの作成
CREATE POLICY "Enable insert for authenticated users with role admin" ON official_exams FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Enable update for authenticated users with role admin" ON official_exams FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Enable delete for authenticated users with role admin" ON official_exams FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
