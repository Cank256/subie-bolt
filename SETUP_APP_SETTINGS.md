# App Settings Setup Guide

This guide will help you set up the `app_settings` table and related functions in your Supabase database.

## Prerequisites

- Access to your Supabase dashboard
- Admin privileges in your Supabase project

## Quick Setup (Recommended)

**Option 1: Use the Complete SQL File**

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the entire contents of `supabase-setup-complete.sql` file
4. Click "Run" to execute all commands at once

This will create the table, enable RLS, create policies, insert default data, and create the required functions.

## Manual Setup (Alternative)

If you prefer to run commands step by step, follow these instructions:

### Step 1: Create the App Settings Table

Run the following SQL commands in your Supabase SQL Editor:

```sql
-- Create the app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for admin users
CREATE POLICY "Admin users can manage app settings" ON app_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
```

## Step 2: Create Helper Functions

```sql
-- Function to get all app settings
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

-- Function to update a specific app setting
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
```

## Step 3: Insert Default Settings

```sql
-- Insert default general settings
INSERT INTO app_settings (setting_key, setting_value) VALUES (
  'general',
  '{
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
  }'
) ON CONFLICT (setting_key) DO NOTHING;

-- Insert default billing settings
INSERT INTO app_settings (setting_key, setting_value) VALUES (
  'billing',
  '{
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
  }'
) ON CONFLICT (setting_key) DO NOTHING;

-- Insert default email settings
INSERT INTO app_settings (setting_key, setting_value) VALUES (
  'email',
  '{
    "smtp_host": "",
    "smtp_port": 587,
    "smtp_username": "",
    "smtp_password": "",
    "from_email": "noreply@subie.app",
    "from_name": "Subie"
  }'
) ON CONFLICT (setting_key) DO NOTHING;

-- Insert default notification settings
INSERT INTO app_settings (setting_key, setting_value) VALUES (
  'notifications',
  '{
    "email_notifications": true,
    "push_notifications": true,
    "sms_notifications": false,
    "marketing_emails": true
  }'
) ON CONFLICT (setting_key) DO NOTHING;

-- Insert default feature settings
INSERT INTO app_settings (setting_key, setting_value) VALUES (
  'features',
  '{
    "user_registration": true,
    "social_login": true,
    "two_factor_auth": false,
    "api_access": true,
    "analytics": true
  }'
) ON CONFLICT (setting_key) DO NOTHING;

-- Insert default maintenance settings
INSERT INTO app_settings (setting_key, setting_value) VALUES (
  'maintenance',
  '{
    "maintenance_mode": false,
    "maintenance_message": "We are currently performing scheduled maintenance. Please check back soon.",
    "allowed_ips": []
  }'
) ON CONFLICT (setting_key) DO NOTHING;
```

## Step 4: Verify Setup

Run this query to verify everything is working:

```sql
-- Test the get_app_settings function
SELECT * FROM get_app_settings();

-- Check all settings
SELECT setting_key, setting_value FROM app_settings;
```

## Verification

After completing the setup, verify everything works:

1. Check that the table exists:
```sql
SELECT * FROM app_settings;
```

2. Test the functions:
```sql
SELECT * FROM get_app_settings();
```

3. Test updating a setting:
```sql
SELECT update_app_setting('general', '{"app_name": "My Custom App"}'::jsonb);
```

## Files Included

- `supabase-setup-complete.sql` - Complete setup script (recommended)
- `SETUP_APP_SETTINGS.md` - This manual guide
- Various migration scripts in the `scripts/` folder (for reference)

## Troubleshooting

- If you get permission errors, make sure you're running the SQL as a database admin
- If RLS policies aren't working, ensure your user has the 'admin' role in their metadata
- The functions use `SECURITY DEFINER` to bypass RLS for administrative operations
- If you still get `PGRST202` errors, ensure the functions were created successfully by checking the Functions tab in your Supabase dashboard

## Step 5: Create Admin User

Make sure you have an admin user to access the settings. After signing up, update your user metadata:

```sql
-- Replace 'your-user-id' with your actual user ID
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
WHERE id = 'your-user-id';
```

## What's Been Implemented

✅ **Database Schema**: Complete `app_settings` table with RLS policies
✅ **Admin Settings Page**: Full settings management interface at `/admin/settings`
✅ **Dynamic Footer**: Footer now pulls contact info from database
✅ **Dynamic Contact Page**: Contact page uses database settings
✅ **Payment Provider Support**: Dropdown for Stripe, Flutterwave, and RevenueCat
✅ **Phone Contact Field**: Added to general settings
✅ **Database Functions**: `get_app_settings()` and `update_app_setting()` functions

## Next Steps

1. Run the SQL commands above in your Supabase dashboard
2. Create an admin user and set their role
3. Visit `/admin/settings` to configure your application
4. Test the footer and contact page to see dynamic content

The application is now fully configured with a comprehensive settings system that allows you to manage all aspects of your app through a user-friendly interface!