-- Add exp and level columns to profiles table
ALTER TABLE profiles
ADD COLUMN exp integer DEFAULT 0,
ADD COLUMN level integer DEFAULT 1;

-- Add comment
COMMENT ON COLUMN profiles.exp IS 'User experience points (1 point per correct answer, 10 bonus points for perfect score)';
COMMENT ON COLUMN profiles.level IS 'User level (calculated as floor(exp/1000) + 1)';
