require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Create client with anon key (same as frontend)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  try {
    console.log('🔐 Testing authentication with created users...');
    
    // Test admin login
    console.log('\n👑 Testing admin login...');
    const { data: adminData, error: adminError } = await supabase.auth.signInWithPassword({
      email: 'admin@subie.com',
      password: 'admin123!'
    });
    
    if (adminError) {
      console.error('❌ Admin login failed:', adminError.message);
    } else {
      console.log('✅ Admin login successful!');
      console.log('   User ID:', adminData.user.id);
      console.log('   Email:', adminData.user.email);
      console.log('   Metadata:', adminData.user.user_metadata);
      
      // Sign out
      await supabase.auth.signOut();
    }
    
    // Test normal user login
    console.log('\n👤 Testing normal user login...');
    const { data: userData, error: userError } = await supabase.auth.signInWithPassword({
      email: 'user@subie.com',
      password: 'user123!'
    });
    
    if (userError) {
      console.error('❌ Normal user login failed:', userError.message);
    } else {
      console.log('✅ Normal user login successful!');
      console.log('   User ID:', userData.user.id);
      console.log('   Email:', userData.user.email);
      console.log('   Metadata:', userData.user.user_metadata);
      
      // Sign out
      await supabase.auth.signOut();
    }
    
    // Test invalid credentials
    console.log('\n🚫 Testing invalid credentials...');
    const { data: invalidData, error: invalidError } = await supabase.auth.signInWithPassword({
      email: 'admin@subie.com',
      password: 'wrongpassword'
    });
    
    if (invalidError) {
      console.log('✅ Invalid credentials correctly rejected:', invalidError.message);
    } else {
      console.log('❌ Invalid credentials should have been rejected!');
    }
    
    console.log('\n🎉 Authentication testing completed!');
    console.log('\n📋 Working Credentials:');
    console.log('👑 Admin: admin@subie.com / admin123!');
    console.log('👤 User: user@subie.com / user123!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testLogin().catch(console.error);
}

module.exports = { testLogin };