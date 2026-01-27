-- Create app_config table for system-wide settings
CREATE TABLE IF NOT EXISTS app_config (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    description text,
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (public settings)
DROP POLICY IF EXISTS "Allow public read access" ON app_config;
CREATE POLICY "Allow public read access" ON app_config
    FOR SELECT USING (true);

-- Allow write access only to admins
-- Check if the user has an 'admin' role in the profiles table
DROP POLICY IF EXISTS "Allow admin update" ON app_config;
CREATE POLICY "Allow admin update" ON app_config
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert default value for referral campaign
INSERT INTO app_config (key, value, description)
VALUES ('referral_campaign_enabled', 'true'::jsonb, 'Enable or disable the referral campaign globally')
ON CONFLICT (key) DO NOTHING;
