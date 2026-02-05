-- Add unique constraint on (user_id, test_key) to prevent duplicate results
-- This is required for the upsert operation to work correctly

-- First, delete duplicate rows keeping only the most recent one
DELETE FROM results a USING (
    SELECT user_id, test_key, MAX(created_at) as max_created_at
    FROM results
    WHERE user_id IS NOT NULL AND test_key IS NOT NULL
    GROUP BY user_id, test_key
    HAVING COUNT(*) > 1
) b
WHERE a.user_id = b.user_id 
  AND a.test_key = b.test_key 
  AND a.created_at < b.max_created_at;

-- Add unique constraint
ALTER TABLE results 
ADD CONSTRAINT results_user_id_test_key_unique 
UNIQUE (user_id, test_key);
