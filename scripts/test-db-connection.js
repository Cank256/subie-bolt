require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
  process.exit(1);
}

// Test with both keys
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Supabase URL:', supabaseUrl);
    
    console.log('\n=== Testing with ANON KEY ===');
    // Test with anon key
    const { data: anonUsers, error: anonError } = await supabaseAnon
      .from('users')
      .select('id, email, first_name, last_name, created_at');
    
    if (anonError) {
      console.error('❌ Anon key error:', anonError);
    } else {
      console.log('✅ Anon key works');
      console.log('Users found with anon key:', anonUsers?.length || 0);
      if (anonUsers && anonUsers.length > 0) {
        anonUsers.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.email}`);
        });
      }
    }
    
    console.log('\n=== Testing with SERVICE KEY ===');
    // Test with service key
    const { data: serviceUsers, error: serviceError } = await supabaseService
      .from('users')
      .select('id, email, first_name, last_name, created_at');
    
    if (serviceError) {
      console.error('❌ Service key error:', serviceError);
    } else {
      console.log('✅ Service key works');
      console.log('Users found with service key:', serviceUsers?.length || 0);
      if (serviceUsers && serviceUsers.length > 0) {
        serviceUsers.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.email} (ID: ${user.id})`);
          console.log(`     Name: ${user.first_name || 'N/A'} ${user.last_name || 'N/A'}`);
          console.log(`     Created: ${user.created_at}`);
        });
      }
    }
    
    // Test specific user lookup with anon key (what the app uses)
    console.log('\n=== Testing admin lookup with ANON KEY (what app uses) ===');
    const { data: adminUser, error: adminError } = await supabaseAnon
      .from('users')
      .select('id, email, password_hash, first_name, last_name')
      .eq('email', 'admin@subie.com')
      .limit(1);
    
    if (adminError) {
      console.error('❌ Error looking up admin user with anon key:', adminError);
    } else {
      console.log('Admin user lookup result with anon key:', adminUser);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection();