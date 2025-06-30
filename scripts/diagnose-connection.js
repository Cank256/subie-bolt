const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

async function diagnoseConnection() {
  console.log('🔍 Diagnosing Supabase connection...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}`);
  
  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    console.log('\n❌ Missing required environment variables!');
    console.log('Please check your .env file and ensure all Supabase credentials are set.');
    return;
  }
  
  // Clean URL (remove trailing slash)
  const cleanUrl = supabaseUrl.replace(/\/$/, '');
  
  // Validate URL format
  try {
    new URL(cleanUrl);
    console.log('✅ Supabase URL format is valid');
  } catch (error) {
    console.log('❌ Invalid Supabase URL format');
    return;
  }
  
  console.log('\n🔗 Testing connections...\n');
  
  // Test with anon key
  console.log('Testing with anon key...');
  const supabaseAnon = createClient(cleanUrl, supabaseAnonKey);
  
  try {
    const { data, error } = await supabaseAnon
      .from('subscription_categories')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Anon key connection failed:', error.message);
    } else {
      console.log('✅ Anon key connection successful');
    }
  } catch (err) {
    console.log('❌ Anon key connection error:', err.message);
  }
  
  // Test with service role key
  console.log('\nTesting with service role key...');
  const supabaseService = createClient(cleanUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  try {
    const { data, error } = await supabaseService
      .from('subscription_categories')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Service role connection failed:', error.message);
      
      // If table doesn't exist, that's expected before migration
      if (error.message.includes('does not exist')) {
        console.log('ℹ️  This is expected if migration hasn\'t been run yet');
      }
    } else {
      console.log('✅ Service role connection successful');
    }
  } catch (err) {
    console.log('❌ Service role connection error:', err.message);
  }
  
  // Test basic connectivity
  console.log('\n🌐 Testing basic connectivity...');
  try {
    const response = await fetch(`${cleanUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Basic HTTP connectivity successful');
    } else {
      console.log(`❌ HTTP connectivity failed: ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    console.log('❌ HTTP connectivity error:', err.message);
  }
  
  console.log('\n📝 Recommendations:');
  console.log('1. Verify your Supabase project is active and not paused');
  console.log('2. Check that your API keys are correct in the .env file');
  console.log('3. Ensure your Supabase project has the correct URL');
  console.log('4. Try running the migration manually in Supabase Dashboard > SQL Editor');
}

if (require.main === module) {
  diagnoseConnection().catch(console.error);
}

module.exports = { diagnoseConnection };