require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAppSettingsTable() {
  try {
    console.log('📦 Creating app_settings table...');
    
    // Create the table using RPC call
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS app_settings (
        id SERIAL PRIMARY KEY,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    const { data: createResult, error: createError } = await supabase.rpc('exec', {
      sql: createTableSQL
    });
    
    if (createError) {
      console.error('❌ Error creating table:', createError);
      return;
    }
    
    console.log('✅ Table created successfully');
    
    // Enable RLS
    const enableRLSSQL = `ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;`;
    
    const { data: rlsResult, error: rlsError } = await supabase.rpc('exec', {
      sql: enableRLSSQL
    });
    
    if (rlsError) {
      console.error('❌ Error enabling RLS:', rlsError);
    } else {
      console.log('✅ RLS enabled');
    }
    
    // Create RLS policy
    const policySQL = `
      CREATE POLICY IF NOT EXISTS "Admin users can manage app settings" ON app_settings
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
          )
        );
    `;
    
    const { data: policyResult, error: policyError } = await supabase.rpc('exec', {
      sql: policySQL
    });
    
    if (policyError) {
      console.error('❌ Error creating policy:', policyError);
    } else {
      console.log('✅ RLS policy created');
    }
    
    // Create helper functions
    const functionsSQL = `
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
    `;
    
    const { data: funcResult, error: funcError } = await supabase.rpc('exec', {
      sql: functionsSQL
    });
    
    if (funcError) {
      console.error('❌ Error creating functions:', funcError);
    } else {
      console.log('✅ Helper functions created');
    }
    
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

createAppSettingsTable();