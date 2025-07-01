const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAdminStats() {
  console.log('🔍 Testing get_admin_stats function...');
  
  try {
    // First check if the function exists
    const { data: functions, error: funcError } = await supabase
      .from('pg_proc')
      .select('proname')
      .eq('proname', 'get_admin_stats');
    
    if (funcError) {
      console.error('Error checking functions:', funcError);
    } else {
      console.log('Functions found:', functions);
    }
    
    // Try to call the function
    const { data, error } = await supabase.rpc('get_admin_stats');
    
    if (error) {
      console.error('❌ Error calling get_admin_stats:', error);
    } else {
      console.log('✅ get_admin_stats result:', data);
    }
    
    // Check if users table has role column
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(5);
    
    if (userError) {
      console.error('❌ Error fetching users with role:', userError);
    } else {
      console.log('✅ Users with role column:', users);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testAdminStats();