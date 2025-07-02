-- Create app_settings table for storing application configuration
CREATE TABLE IF NOT EXISTS app_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write settings
CREATE POLICY "Admin can manage app settings" ON app_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insert default settings
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
}'),
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
}'),
('email', '{
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_username": "",
  "smtp_password": "",
  "smtp_encryption": "tls",
  "from_email": "noreply@subie.app",
  "from_name": "Subie"
}'),
('notifications', '{
  "email_notifications": true,
  "push_notifications": true,
  "sms_notifications": false,
  "admin_alerts": true,
  "user_welcome_email": true,
  "subscription_reminders": true
}'),
('features', '{
  "user_registration": true,
  "email_verification": true,
  "password_reset": true,
  "social_login": false,
  "two_factor_auth": false,
  "api_access": true,
  "analytics_tracking": true
}'),
('maintenance', '{
  "maintenance_mode": false,
  "maintenance_message": "We are currently performing scheduled maintenance. Please check back soon.",
  "allowed_ips": []
}')
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to get settings
CREATE OR REPLACE FUNCTION get_app_settings()
RETURNS TABLE(setting_key text, setting_value jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT app_settings.setting_key, app_settings.setting_value
  FROM app_settings;
END;
$$;

-- Create function to update settings
CREATE OR REPLACE FUNCTION update_app_setting(key text, value jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  INSERT INTO app_settings (setting_key, setting_value, updated_at)
  VALUES (key, value, now())
  ON CONFLICT (setting_key) 
  DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    updated_at = now();
END;
$$;