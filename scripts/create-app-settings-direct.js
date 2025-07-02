require('dotenv').config();
const { Client } = require('pg');

// Parse the Supabase URL to get connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Extract database connection details from Supabase URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('Could not extract project reference from Supabase URL');
  process.exit(1);
}

// Use the pooler connection string format
const connectionString = `postgresql://postgres.${projectRef}:${process.env.SUPABASE_DB_PASSWORD || 'Subie2025!'}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

async function createAppSettings() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('📦 Connected to database, creating app_settings...');

    // Create the app_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        id SERIAL PRIMARY KEY,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ app_settings table created');

    // Enable RLS
    await client.query('ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;');
    console.log('✅ RLS enabled on app_settings');

    // Create RLS policy
    await client.query(`
      DROP POLICY IF EXISTS "Admin users can manage app settings" ON app_settings;
      CREATE POLICY "Admin users can manage app settings" ON app_settings
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
          )
        );
    `);
    console.log('✅ RLS policy created');

    // Insert default settings
    await client.query(`
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
        }')
      ON CONFLICT (setting_key) DO UPDATE SET
        setting_value = EXCLUDED.setting_value,
        updated_at = NOW();
    `);
    console.log('✅ Default settings inserted');

    // Create get_app_settings function
    await client.query(`
      CREATE OR REPLACE FUNCTION get_app_settings()
      RETURNS TABLE(setting_key TEXT, setting_value JSONB)
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
        
        RETURN QUERY
        SELECT app_settings.setting_key, app_settings.setting_value
        FROM app_settings;
      END;
      $$;
    `);
    console.log('✅ get_app_settings function created');

    // Create update_app_setting function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_app_setting(key TEXT, value JSONB)
      RETURNS VOID
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
        
        INSERT INTO app_settings (setting_key, setting_value)
        VALUES (key, value)
        ON CONFLICT (setting_key) DO UPDATE SET
          setting_value = EXCLUDED.setting_value,
          updated_at = NOW();
      END;
      $$;
    `);
    console.log('✅ update_app_setting function created');

    console.log('🎉 App settings setup completed successfully!');

  } catch (error) {
    console.error('❌ Error creating app settings:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAppSettings();