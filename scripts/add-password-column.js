require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPasswordColumn() {
  try {
    console.log('Attempting to add password_hash column to users table...');
    
    // First, let's check current columns by querying the users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.error('Error querying users table:', usersError);
      return;
    }
    
    if (users && users.length > 0) {
      console.log('Current user table columns:', Object.keys(users[0]));
      
      // Check if password_hash already exists
      if (users[0].hasOwnProperty('password_hash')) {
        console.log('✅ password_hash column already exists!');
        return;
      }
    }
    
    console.log('❌ password_hash column does not exist.');
    console.log('\n🔧 To fix this, you need to manually add the column via Supabase Dashboard:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to Table Editor > users table');
    console.log('3. Click "Add Column"');
    console.log('4. Add column with these settings:');
    console.log('   - Name: password_hash');
    console.log('   - Type: text');
    console.log('   - Default value: (leave empty)');
    console.log('   - Allow nullable: Yes');
    console.log('5. Save the column');
    console.log('\nAlternatively, run this SQL in the SQL Editor:');
    console.log('ALTER TABLE public.users ADD COLUMN password_hash TEXT;');
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

addPasswordColumn();