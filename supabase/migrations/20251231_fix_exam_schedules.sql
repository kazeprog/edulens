-- ==========================================
-- exam_schedules テーブル修正用スクリプト
-- CSVに含まれる不足カラムを追加します
-- ==========================================

DROP TABLE IF EXISTS exam_schedules CASCADE;

CREATE TABLE IF NOT EXISTS exam_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL,
    session_slug TEXT NOT NULL,
    exam_name TEXT NOT NULL,
    session_name TEXT NOT NULL,
    primary_exam_date DATE NOT NULL,
    result_date DATE,
    is_active BOOLEAN DEFAULT true,
    -- 追加カラム (CSV/Codebaseから推測)
    application_start DATE,
    application_end DATE,
    secondary_exam_date_a DATE,
    secondary_exam_date_b DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exam_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for exam_schedules" ON exam_schedules FOR SELECT USING (true);

-- 管理者ポリシー
CREATE POLICY "Admins can manage exam_schedules" ON exam_schedules FOR ALL USING (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
