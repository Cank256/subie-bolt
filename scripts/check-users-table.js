require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsersTable() {
  try {
    console.log('🔍 Checking users table structure...');
    
    // Try to select from users table to see what columns exist
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error querying users table:', error);
      
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('\n🔧 The error suggests a missing column. Let me check what columns exist...');
        
        // Try a basic select to see table structure
        const { data: basicData, error: basicError } = await supabase
          .from('users')
          .select('id')
          .limit(1);
          
        if (basicError) {
          console.error('❌ Even basic query failed:', basicError);
        } else {
          console.log('✅ Users table exists, but some columns are missing');
        }
      }
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Users table structure (sample row):');
      console.log('Available columns:', Object.keys(data[0]));
      
      // Check specifically for role column
      if ('role' in data[0]) {
        console.log('✅ Role column exists');
      } else {
        console.log('❌ Role column is missing');
      }
      
      // Check for password_hash column
      if ('password_hash' in data[0]) {
        console.log('✅ Password hash column exists');
      } else {
        console.log('❌ Password hash column is missing');
      }
    } else {
      console.log('✅ Users table exists but is empty');
      
      // Try to insert a test row to see what columns are expected
      console.log('\n🧪 Testing table structure with minimal insert...');
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          email: 'test@example.com',
          role: 'user'
        });
        
      if (insertError) {
        console.log('❌ Insert test failed:', insertError.message);
        if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
          console.log('🔧 This confirms the role column is missing');
        }
      } else {
        console.log('✅ Test insert successful - role column exists');
        // Clean up test data
        await supabase.from('users').delete().eq('email', 'test@example.com');
      }
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkUsersTable();