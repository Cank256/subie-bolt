require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAuthUsers() {
  try {
    console.log('🔐 Creating Supabase Auth users...');
    
    // Create admin user in Supabase Auth
    console.log('👑 Creating admin auth user...');
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@subie.com',
      password: 'admin123!',
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin'
      }
    });
    
    if (adminError) {
      if (adminError.message.includes('already registered')) {
        console.log('✅ Admin user already exists in Supabase Auth');
      } else {
        console.error('❌ Error creating admin auth user:', adminError.message);
        throw adminError;
      }
    } else {
      console.log('✅ Admin auth user created successfully');
      console.log('   Auth ID:', adminData.user.id);
    }
    
    // Create normal user in Supabase Auth
    console.log('👤 Creating normal auth user...');
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'user@subie.com',
      password: 'user123!',
      email_confirm: true,
      user_metadata: {
        first_name: 'John',
        last_name: 'Doe',
        role: 'user'
      }
    });
    
    if (userError) {
      if (userError.message.includes('already registered')) {
        console.log('✅ Normal user already exists in Supabase Auth');
      } else {
        console.error('❌ Error creating normal auth user:', userError.message);
        throw userError;
      }
    } else {
      console.log('✅ Normal auth user created successfully');
      console.log('   Auth ID:', userData.user.id);
    }
    
    console.log('\n🎉 Supabase Auth users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('👑 Admin User:');
    console.log('   Email: admin@subie.com');
    console.log('   Password: admin123!');
    console.log('\n👤 Normal User:');
    console.log('   Email: user@subie.com');
    console.log('   Password: user123!');
    console.log('\n💡 You can now log in through the application!');
    
  } catch (error) {
    console.error('❌ Failed to create auth users:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Ensure your SUPABASE_SERVICE_ROLE_KEY is correct');
    console.error('2. Check that your Supabase project allows user creation');
    console.error('3. Verify your project is not paused');
    process.exit(1);
  }
}

if (require.main === module) {
  createAuthUsers().catch(console.error);
}

module.exports = { createAuthUsers };