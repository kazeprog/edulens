-- Add columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invited_count int DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pro_expires_at timestamptz;
-- Ensure test_count exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS test_count int DEFAULT 0;

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    referred_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);

-- Check reward logic helper (to avoid duplication)
CREATE OR REPLACE FUNCTION check_referral_reward(p_referrer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_inviter_count int;
    v_current_expires timestamptz;
BEGIN
    SELECT invited_count, pro_expires_at INTO v_inviter_count, v_current_expires
    FROM profiles WHERE id = p_referrer_id;

    IF v_inviter_count % 3 = 0 THEN
        -- Grant 30 days
        IF v_current_expires IS NULL OR v_current_expires < now() THEN
            v_current_expires := now() + interval '30 days';
        ELSE
            v_current_expires := v_current_expires + interval '30 days';
        END IF;

        UPDATE profiles
        SET pro_expires_at = v_current_expires,
            is_pro = true
        WHERE id = p_referrer_id;
    END IF;
END;
$$;

-- Function to increment test count and handle referral logic
CREATE OR REPLACE FUNCTION increment_profile_test_count(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_count int;
    v_referrer_id uuid;
    v_referral_id uuid;
BEGIN
    -- 1. Increment test_count
    UPDATE profiles
    SET test_count = COALESCE(test_count, 0) + 1
    WHERE id = p_user_id
    RETURNING test_count INTO v_new_count;

    -- 2. Check if this unlocks a referral (Trigger at 10 tests)
    IF v_new_count = 10 THEN
        SELECT id, referrer_id INTO v_referral_id, v_referrer_id
        FROM referrals
        WHERE referred_id = p_user_id AND status = 'pending';

        IF v_referral_id IS NOT NULL THEN
            -- Update referral status
            UPDATE referrals SET status = 'completed' WHERE id = v_referral_id;

            -- Increment inviter's count
            UPDATE profiles
            SET invited_count = COALESCE(invited_count, 0) + 1
            WHERE id = v_referrer_id;

            -- Check for reward
            PERFORM check_referral_reward(v_referrer_id);
        END IF;
    END IF;
END;
$$;

-- Function to claim a referral code
CREATE OR REPLACE FUNCTION claim_referral_code(p_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_referrer_id uuid;
    v_user_id uuid;
    v_test_count int;
    v_status text := 'pending';
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'Not authenticated');
    END IF;

    p_code := trim(p_code);

    -- Find referrer
    SELECT id INTO v_referrer_id FROM profiles WHERE referral_code = p_code;
    
    IF v_referrer_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', '招待コードが見つかりません');
    END IF;

    IF v_referrer_id = v_user_id THEN
        RETURN json_build_object('success', false, 'message', '自分自身を招待することはできません');
    END IF;

    -- Check if already referred
    IF EXISTS (SELECT 1 FROM referrals WHERE referred_id = v_user_id) THEN
        RETURN json_build_object('success', false, 'message', '既に招待コードを使用済みです');
    END IF;

    -- Check if user already meets criteria (test_count >= 10)
    SELECT test_count INTO v_test_count FROM profiles WHERE id = v_user_id;
    IF COALESCE(v_test_count, 0) >= 10 THEN
        v_status := 'completed';
    END IF;

    -- Insert
    INSERT INTO referrals (referrer_id, referred_id, status)
    VALUES (v_referrer_id, v_user_id, v_status);

    -- If completed immediately, count it
    IF v_status = 'completed' THEN
        UPDATE profiles
        SET invited_count = COALESCE(invited_count, 0) + 1
        WHERE id = v_referrer_id;

        PERFORM check_referral_reward(v_referrer_id);
    END IF;

    RETURN json_build_object('success', true);
END;
$$;

-- Helper to ensure referral_code exists for current user
CREATE OR REPLACE FUNCTION ensure_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
    v_code text;
    v_exists boolean;
BEGIN
    v_user_id := auth.uid();
    SELECT referral_code INTO v_code FROM profiles WHERE id = v_user_id;
    
    IF v_code IS NOT NULL THEN
        RETURN v_code;
    END IF;

    -- Generate a simple random code (e.g., USER-XXXX)
    LOOP
        v_code := 'USER-' || substring(md5(random()::text) from 1 for 6);
        SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = v_code) INTO v_exists;
        EXIT WHEN NOT v_exists;
    END LOOP;

    UPDATE profiles SET referral_code = UPPER(v_code) WHERE id = v_user_id;
    RETURN UPPER(v_code);
END;
$$;
