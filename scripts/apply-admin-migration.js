const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyAdminMigration() {
  try {
    console.log('🚀 Applying admin role migration...');
    
    // Read the admin migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20250130000001_add_admin_role.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📝 Migration content:');
    console.log(migrationSQL.substring(0, 200) + '...');
    
    // Split into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`\n📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement individually
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`\n⚡ Executing statement ${i + 1}/${statements.length}:`);
          console.log(statement.substring(0, 100) + '...');
          
          // Use a direct SQL execution approach
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey
            },
            body: JSON.stringify({ sql: statement })
          });
          
          if (response.ok) {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          } else {
            const errorText = await response.text();
            console.log(`⚠️  Statement ${i + 1} response:`, errorText);
            
            // Check if it's just a "already exists" type error
            if (errorText.includes('already exists') || errorText.includes('duplicate')) {
              console.log(`ℹ️  Statement ${i + 1} skipped (already exists)`);
            }
          }
          
        } catch (err) {
          console.error(`❌ Error executing statement ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('\n🎉 Admin migration completed!');
    
    // Verify the role column was added
    console.log('\n🔍 Verifying role column...');
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(1);
    
    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('❌ Role column still missing - trying manual approach...');
        await addRoleColumnManually();
      } else {
        console.error('❌ Error verifying role column:', error);
      }
    } else {
      console.log('✅ Role column successfully added!');
      if (data && data.length > 0) {
        console.log('Sample data:', data[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function addRoleColumnManually() {
  try {
    console.log('\n🔧 Adding role column manually...');
    
    // Simple ALTER TABLE command
    const alterSQL = "ALTER TABLE users ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'))";
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql: alterSQL })
    });
    
    if (response.ok) {
      console.log('✅ Role column added manually!');
    } else {
      const errorText = await response.text();
      console.log('❌ Manual addition failed:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Manual addition error:', error);
  }
}

// Run migration
if (require.main === module) {
  applyAdminMigration().catch(console.error);
}

module.exports = { applyAdminMigration };