-- ============================================================
-- Mistapers' Mistake: みんながミスる英単語ランキング
-- 集計テーブル + 集計/取得RPC関数
-- ============================================================

-- 1. 集計結果テーブル
CREATE TABLE IF NOT EXISTS mistap_mistake_rankings (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category text NOT NULL,            -- 'junior_english' | 'senior_english' | 'kobun'
    word text NOT NULL,
    meaning text NOT NULL,
    mistake_count integer NOT NULL DEFAULT 0,
    total_tested integer NOT NULL DEFAULT 0,
    mistake_rate numeric(5,2) NOT NULL DEFAULT 0,
    rank integer NOT NULL DEFAULT 0,
    aggregated_at timestamptz NOT NULL DEFAULT now()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_mistake_rankings_category_rank
    ON mistap_mistake_rankings (category, rank);
CREATE INDEX IF NOT EXISTS idx_mistake_rankings_aggregated
    ON mistap_mistake_rankings (aggregated_at DESC);

-- RLS有効化
ALTER TABLE mistap_mistake_rankings ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能（Pro制限はフロントエンド側で行う）
CREATE POLICY "Anyone can read mistake rankings"
    ON mistap_mistake_rankings FOR SELECT
    USING (true);

-- 管理者のみ書き込み可能（RPCは SECURITY DEFINER で実行）
-- ※ 一般ユーザーは書き込み不可

-- ============================================================
-- 2. 集計RPC関数: aggregate_mistake_rankings()
--    全ユーザーのresultsテーブルから間違い単語を集計し、
--    カテゴリ別TOP100をランキングテーブルに保存する
-- ============================================================
CREATE OR REPLACE FUNCTION aggregate_mistake_rankings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 古いデータを削除
    DELETE FROM mistap_mistake_rankings;

    -- 共通CTE: resultsテーブルからincorrect_wordsとcorrect_wordsを展開
    WITH
    -- incorrect_wordsを展開
    incorrect_expanded AS (
        SELECT
            r.selected_text,
            (elem ->> 'word') AS word,
            (elem ->> 'meaning') AS meaning
        FROM results r,
             jsonb_array_elements(r.incorrect_words) AS elem
        WHERE r.incorrect_words IS NOT NULL
          AND jsonb_array_length(r.incorrect_words) > 0
    ),
    -- correct_wordsを展開
    correct_expanded AS (
        SELECT
            r.selected_text,
            (elem ->> 'word') AS word
        FROM results r,
             jsonb_array_elements(r.correct_words) AS elem
        WHERE r.correct_words IS NOT NULL
          AND jsonb_array_length(r.correct_words) > 0
    ),
    -- カテゴリ分類関数的CTE
    categorized_incorrect AS (
        SELECT
            word,
            meaning,
            CASE
                WHEN selected_text ILIKE '%New Crown%' OR selected_text ILIKE '%New Horizon%'
                    THEN 'junior_english'
                WHEN selected_text ILIKE '%古文単語%' OR selected_text ILIKE '%kobun%'
                    THEN 'kobun'
                ELSE 'senior_english'
            END AS category,
            1 AS is_mistake
        FROM incorrect_expanded
    ),
    categorized_correct AS (
        SELECT
            word,
            CASE
                WHEN selected_text ILIKE '%New Crown%' OR selected_text ILIKE '%New Horizon%'
                    THEN 'junior_english'
                WHEN selected_text ILIKE '%古文単語%' OR selected_text ILIKE '%kobun%'
                    THEN 'kobun'
                ELSE 'senior_english'
            END AS category,
            0 AS is_mistake
        FROM correct_expanded
    ),
    -- 間違い回数の集計
    mistake_counts AS (
        SELECT category, word, meaning, COUNT(*) AS mistake_count
        FROM categorized_incorrect
        GROUP BY category, word, meaning
    ),
    -- 正解回数の集計
    correct_counts AS (
        SELECT category, word, COUNT(*) AS correct_count
        FROM categorized_correct
        GROUP BY category, word
    ),
    -- 結合してランキング計算
    combined AS (
        SELECT
            m.category,
            m.word,
            m.meaning,
            m.mistake_count,
            m.mistake_count + COALESCE(c.correct_count, 0) AS total_tested,
            ROUND(
                m.mistake_count::numeric / NULLIF(m.mistake_count + COALESCE(c.correct_count, 0), 0) * 100,
                2
            ) AS mistake_rate,
            ROW_NUMBER() OVER (
                PARTITION BY m.category
                ORDER BY m.mistake_count DESC, m.word ASC
            ) AS rank
        FROM mistake_counts m
        LEFT JOIN correct_counts c ON m.category = c.category AND m.word = c.word
    )
    -- TOP100をINSERT
    INSERT INTO mistap_mistake_rankings (category, word, meaning, mistake_count, total_tested, mistake_rate, rank, aggregated_at)
    SELECT category, word, meaning, mistake_count, total_tested, mistake_rate, rank::integer, now()
    FROM combined
    WHERE rank <= 100
    ORDER BY category, rank;
END;
$$;

-- ============================================================
-- 3. 取得RPC関数: get_mistake_rankings(p_category)
--    指定カテゴリのランキングを返す
-- ============================================================
CREATE OR REPLACE FUNCTION get_mistake_rankings(p_category text)
RETURNS TABLE (
    rank integer,
    word text,
    meaning text,
    mistake_count integer,
    total_tested integer,
    mistake_rate numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        mr.rank,
        mr.word,
        mr.meaning,
        mr.mistake_count,
        mr.total_tested,
        mr.mistake_rate
    FROM mistap_mistake_rankings mr
    WHERE mr.category = p_category
    ORDER BY mr.rank ASC
    LIMIT 100;
END;
$$;

-- ============================================================
-- 4. 最終集計日時取得関数
-- ============================================================
CREATE OR REPLACE FUNCTION get_mistake_rankings_last_updated()
RETURNS timestamptz
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT COALESCE(MAX(aggregated_at), '1970-01-01'::timestamptz)
    FROM mistap_mistake_rankings;
$$;

-- ============================================================
-- 5. pg_cron: 毎日午前3時(JST = UTC 18:00)に自動集計
-- ============================================================
-- Supabase Dashboard > Database > Extensions で pg_cron を有効化してから実行
-- pg_cronが未有効の場合はスキップしてNOTICEを表示
DO $$
BEGIN
    PERFORM cron.schedule(
        'aggregate-mistake-rankings-daily',
        '0 18 * * *',
        'SELECT aggregate_mistake_rankings()'
    );
    RAISE NOTICE 'pg_cron job scheduled successfully';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'pg_cron is not enabled. Please enable it via Supabase Dashboard > Database > Extensions, then run: SELECT cron.schedule(''aggregate-mistake-rankings-daily'', ''0 18 * * *'', ''SELECT aggregate_mistake_rankings()'');';
END;
$$;
