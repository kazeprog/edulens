-- ==========================================
-- university_events テーブル修正用スクリプト
-- category カラムが不足していたため再作成します
-- ==========================================

DROP TABLE IF EXISTS university_events CASCADE;

CREATE TABLE IF NOT EXISTS university_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    category TEXT, -- CSVに含まれていたため追加
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS設定
ALTER TABLE university_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for university_events" ON university_events FOR SELECT USING (true);
