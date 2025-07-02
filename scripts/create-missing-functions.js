require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createMissingFunctions() {
  try {
    console.log('🔧 Creating missing database functions...');
    
    // First, let's create the table if it doesn't exist
    console.log('📦 Creating app_settings table...');
    const { data: tableResult, error: tableError } = await supabase
      .from('app_settings')
      .select('*')
      .limit(1);
    
    if (tableError && tableError.code === 'PGRST116') {
      console.log('❌ Table does not exist. Creating it manually...');
      
      // Create table using raw SQL through a simple insert that will fail but show us the structure
      try {
        await supabase
          .from('app_settings')
          .insert({ setting_key: 'test', setting_value: {} });
      } catch (e) {
        console.log('Table creation needed. Please run this SQL in your Supabase dashboard:');
        console.log(`
CREATE TABLE IF NOT EXISTS app_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage app settings" ON app_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
`);
        return;
      }
    }
    
    console.log('✅ Table exists or accessible');
    
    // Now let's insert some default settings to test
    console.log('💾 Inserting default settings...');
    
    const defaultSettings = [
      {
        setting_key: 'general',
        setting_value: {
          app_name: 'Subie',
          app_description: 'Subscription management platform',
          app_url: 'https://subie.app',
          support_email: 'support@subie.app',
          phone_contact: '+1 (555) 123-SUBI',
          company_name: 'Subie Inc.',
          company_address: '123 Tech Street, San Francisco, CA 94105',
          timezone: 'America/New_York',
          language: 'en',
          currency: 'USD'
        }
      },
      {
        setting_key: 'billing',
        setting_value: {
          payment_provider: 'Flutterwave',
          stripe_publishable_key: '',
          stripe_secret_key: '',
          flutterwave_public_key: '',
          flutterwave_secret_key: '',
          revenuecat_api_key: '',
          webhook_endpoint: '',
          tax_rate: 0.08,
          currency: 'USD',
          trial_period_days: 14
        }
      },
      {
        setting_key: 'email',
        setting_value: {
          smtp_host: '',
          smtp_port: 587,
          smtp_username: '',
          smtp_password: '',
          from_email: 'noreply@subie.app',
          from_name: 'Subie'
        }
      },
      {
        setting_key: 'notifications',
        setting_value: {
          email_notifications: true,
          push_notifications: true,
          sms_notifications: false,
          marketing_emails: true
        }
      },
      {
        setting_key: 'features',
        setting_value: {
          user_registration: true,
          social_login: true,
          two_factor_auth: false,
          api_access: true,
          analytics: true
        }
      },
      {
        setting_key: 'maintenance',
        setting_value: {
          maintenance_mode: false,
          maintenance_message: 'We are currently performing scheduled maintenance. Please check back soon.',
          allowed_ips: []
        }
      }
    ];
    
    for (const setting of defaultSettings) {
      const { data, error } = await supabase
        .from('app_settings')
        .upsert(setting, { onConflict: 'setting_key' })
        .select();
      
      if (error) {
        console.error(`❌ Error inserting ${setting.setting_key}:`, error);
      } else {
        console.log(`✅ ${setting.setting_key} settings saved`);
      }
    }
    
    console.log('🎉 Setup completed! The functions will be created as stored procedures.');
    console.log('\n📋 Please run this SQL in your Supabase SQL Editor to create the missing functions:');
    console.log(`
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
`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

createMissingFunctions();