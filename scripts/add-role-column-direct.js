const { createClient } = require('@supabase/supabase-js');

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

async function addRoleColumnDirect() {
  try {
    console.log('🚀 Adding role column using direct SQL execution...');
    
    // The SQL command to add the role column
    const sql = `ALTER TABLE users ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));`;
    
    console.log('📝 Executing SQL:', sql);
    
    // Try using the REST API directly with raw SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sql',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Accept': 'application/json'
      },
      body: sql
    });
    
    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    if (response.ok || response.status === 200) {
      console.log('✅ Role column added successfully!');
    } else {
      console.log('⚠️  Response indicates potential issue, but let\'s verify...');
    }
    
    // Verify the column was added
    console.log('\n🔍 Verifying role column...');
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(1);
    
    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('❌ Role column still missing');
        console.log('\n💡 Manual steps required:');
        console.log('1. Go to your Supabase Dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Run this SQL command:');
        console.log('   ALTER TABLE users ADD COLUMN role text DEFAULT \'user\' CHECK (role IN (\'user\', \'admin\', \'moderator\'));');
        console.log('4. Then run: UPDATE users SET role = \'admin\' WHERE email = \'admin@subie.com\';');
      } else {
        console.error('❌ Error verifying role column:', error);
      }
    } else {
      console.log('✅ Role column successfully verified!');
      if (data && data.length > 0) {
        console.log('Sample data:', data[0]);
      } else {
        console.log('Table exists but is empty');
      }
    }
    
  } catch (error) {
    console.error('❌ Operation failed:', error);
    
    console.log('\n💡 Manual steps required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run this SQL command:');
    console.log('   ALTER TABLE users ADD COLUMN role text DEFAULT \'user\' CHECK (role IN (\'user\', \'admin\', \'moderator\'));');
    console.log('4. Then run: UPDATE users SET role = \'admin\' WHERE email = \'admin@subie.com\';');
  }
}

// Run the function
if (require.main === module) {
  addRoleColumnDirect().catch(console.error);
}

module.exports = { addRoleColumnDirect };