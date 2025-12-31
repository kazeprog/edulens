-- ==========================================
-- official_exams テーブル修正用スクリプト
-- CSVに含まれる不足カラムを追加します
-- ==========================================

DROP TABLE IF EXISTS official_exams CASCADE;

CREATE TABLE IF NOT EXISTS official_exams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prefecture_id BIGINT REFERENCES prefectures(id),
    year INTEGER NOT NULL,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    result_date DATE,
    -- 以下、CSVに含まれていた追加カラム
    application_start DATE,
    application_end DATE,
    secondary_exam_date_a DATE, -- 必要に応じて型調整
    secondary_exam_date_b DATE, -- 必要に応じて型調整
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS設定
ALTER TABLE official_exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for official_exams" ON official_exams FOR SELECT USING (true);
