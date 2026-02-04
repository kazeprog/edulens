-- Add mode column to results table
-- This column stores the test mode: 'word-meaning' or 'meaning-word'

ALTER TABLE results ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'word-meaning';

-- Add comment for documentation
COMMENT ON COLUMN results.mode IS 'Test mode: word-meaning (default) or meaning-word';
