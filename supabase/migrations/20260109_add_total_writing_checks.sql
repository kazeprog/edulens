-- Add total_writing_checks column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_writing_checks INTEGER DEFAULT 0;

-- Create RPC function to increment the counter atomically
CREATE OR REPLACE FUNCTION increment_total_writing_checks(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET total_writing_checks = COALESCE(total_writing_checks, 0) + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
