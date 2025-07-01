require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAppSettings() {
  try {
    console.log('📦 Setting up app settings...');
    
    // First, let's check if the table exists by trying to select from it
    console.log('🔍 Checking if app_settings table exists...');
    const { data: existingData, error: checkError } = await supabase
      .from('app_settings')
      .select('*')
      .limit(1);
    
    if (checkError && checkError.code === 'PGRST116') {
      console.log('❌ app_settings table does not exist');
      console.log('⚠️  Please create the table manually in Supabase dashboard:');
      console.log(`
CREATE TABLE app_settings (
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
    
    if (existingData) {
      console.log('✅ app_settings table exists');
      console.log('📊 Current settings:', existingData);
    }
    
    // Insert or update default settings
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
          payment_provider: 'RevenueCat',
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
    
    // Test reading the settings
    console.log('🔍 Testing settings retrieval...');
    const { data: allSettings, error: readError } = await supabase
      .from('app_settings')
      .select('*');
    
    if (readError) {
      console.error('❌ Error reading settings:', readError);
    } else {
      console.log('✅ Settings retrieved successfully:');
      allSettings.forEach(setting => {
        console.log(`  - ${setting.setting_key}:`, Object.keys(setting.setting_value));
      });
    }
    
    console.log('🎉 App settings setup completed!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupAppSettings();