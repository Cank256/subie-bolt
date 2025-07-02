-- Complete Supabase setup for app_settings
-- Run this entire script in your Supabase SQL Editor

-- 1. Create the app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policy for admin users
DROP POLICY IF EXISTS "Admin users can manage app settings" ON app_settings;
CREATE POLICY "Admin users can manage app settings" ON app_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 4. Create policy for service role (for server-side operations)
DROP POLICY IF EXISTS "Service role can manage app settings" ON app_settings;
CREATE POLICY "Service role can manage app settings" ON app_settings
  FOR ALL USING (auth.role() = 'service_role');

-- 5. Function to get all app settings
CREATE OR REPLACE FUNCTION get_app_settings()
RETURNS TABLE(setting_key TEXT, setting_value JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT app_settings.setting_key, app_settings.setting_value
  FROM app_settings;
END;
$$;

-- 6. Function to update a specific app setting
CREATE OR REPLACE FUNCTION update_app_setting(key TEXT, value JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO app_settings (setting_key, setting_value, updated_at)
  VALUES (key, value, NOW())
  ON CONFLICT (setting_key)
  DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    updated_at = NOW();
END;
$$;

-- 7. Insert default settings
INSERT INTO app_settings (setting_key, setting_value) VALUES
('general', '{
  "app_name": "Subie",
  "app_description": "Subscription management platform",
  "app_url": "https://subie.app",
  "support_email": "support@subie.app",
  "phone_contact": "+1 (555) 123-SUBI",
  "company_name": "Subie Inc.",
  "company_address": "123 Tech Street, San Francisco, CA 94105",
  "timezone": "America/New_York",
  "language": "en",
  "currency": "USD"
}'::jsonb),

('billing', '{
  "payment_provider": "Flutterwave",
  "stripe_publishable_key": "",
  "stripe_secret_key": "",
  "flutterwave_public_key": "",
  "flutterwave_secret_key": "",
  "revenuecat_api_key": "",
  "webhook_endpoint": "",
  "tax_rate": 0.08,
  "currency": "USD",
  "trial_period_days": 14
}'::jsonb),

('email', '{
  "smtp_host": "",
  "smtp_port": 587,
  "smtp_username": "",
  "smtp_password": "",
  "from_email": "noreply@subie.app",
  "from_name": "Subie"
}'::jsonb),

('notifications', '{
  "email_notifications": true,
  "push_notifications": true,
  "sms_notifications": false,
  "marketing_emails": true
}'::jsonb),

('features', '{
  "user_registration": true,
  "social_login": true,
  "two_factor_auth": false,
  "api_access": true,
  "analytics": true
}'::jsonb),

('maintenance', '{
  "maintenance_mode": false,
  "maintenance_message": "We are currently performing scheduled maintenance. Please check back soon.",
  "allowed_ips": []
}'::jsonb)

ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = NOW();

-- 8. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON app_settings TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_app_settings() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_app_setting(TEXT, JSONB) TO anon, authenticated;

-- 9. Verify the setup
SELECT 'Setup completed successfully!' as status;
SELECT setting_key, setting_value FROM app_settings ORDER BY setting_key;