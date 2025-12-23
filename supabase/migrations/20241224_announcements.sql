-- お知らせテーブルの作成
CREATE TABLE IF NOT EXISTS announcements (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON announcements(start_date, end_date);

-- RLSを有効化
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能（アクティブなお知らせのみ）
CREATE POLICY "Anyone can read active announcements"
    ON announcements
    FOR SELECT
    USING (
        is_active = true
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
    );

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_announcements_updated_at_trigger
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_announcements_updated_at();

-- サンプルデータ（必要に応じてコメントアウト解除）
-- INSERT INTO announcements (title, message, type, is_active) VALUES 
-- ('メンテナンスのお知らせ', '12月25日 2:00-4:00 にシステムメンテナンスを実施します。', 'warning', true);
