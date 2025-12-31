-- ==========================================
-- NOTE: すでに誤ったテーブルを作成してしまった場合は、
-- 左側のTable Editorから `exam_schedules`, `official_exams`, `university_events` を
-- 一度削除（Delete）してから、このSQLを実行してください。
-- (`prefectures` は JISコード(数値) なのでそのままでOKですが、再作成しても良いです)
-- ==========================================

-- ==========================================
-- 1. prefectures (都道府県)
-- ==========================================
CREATE TABLE IF NOT EXISTS prefectures (
    id BIGINT PRIMARY KEY, -- JISコード (1~47) なので数値
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    region TEXT NOT NULL,
    education_board_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE prefectures ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for prefectures" ON prefectures;
CREATE POLICY "Public read access for prefectures" ON prefectures FOR SELECT USING (true);


-- ==========================================
-- 2. official_exams (公立高校入試日程)
-- ==========================================
CREATE TABLE IF NOT EXISTS official_exams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- UUID修正
    prefecture_id BIGINT REFERENCES prefectures(id),
    year INTEGER NOT NULL,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    result_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE official_exams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for official_exams" ON official_exams;
CREATE POLICY "Public read access for official_exams" ON official_exams FOR SELECT USING (true);


-- ==========================================
-- 3. university_events (大学入試イベント)
-- ==========================================
CREATE TABLE IF NOT EXISTS university_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- UUID修正
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE university_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for university_events" ON university_events;
CREATE POLICY "Public read access for university_events" ON university_events FOR SELECT USING (true);


-- ==========================================
-- 4. exam_schedules (資格試験)
-- ==========================================
CREATE TABLE IF NOT EXISTS exam_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- UUID修正
    slug TEXT NOT NULL,
    session_slug TEXT NOT NULL,
    exam_name TEXT NOT NULL,
    session_name TEXT NOT NULL,
    primary_exam_date DATE NOT NULL,
    result_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exam_schedules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for exam_schedules" ON exam_schedules;
CREATE POLICY "Public read access for exam_schedules" ON exam_schedules FOR SELECT USING (true);

-- 管理者ポリシー (admin_policies.sqlと重複してもOK)
DROP POLICY IF EXISTS "Admins can manage exam_schedules" ON exam_schedules;
CREATE POLICY "Admins can manage exam_schedules"
ON exam_schedules
FOR ALL
USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);
