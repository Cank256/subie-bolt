require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function examineTokens() {
  try {
    console.log('🔍 Examining real Supabase tokens...');
    
    // Sign in to get real tokens
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@subie.com',
      password: 'admin123!'
    });
    
    if (error) {
      console.error('❌ Login failed:', error.message);
      return;
    }
    
    console.log('\n📋 Real Supabase Session Data:');
    console.log('Session:', JSON.stringify(data.session, null, 2));
    
    console.log('\n🔑 Token Analysis:');
    console.log('Access Token Length:', data.session.access_token.length);
    console.log('Access Token Preview:', data.session.access_token.substring(0, 50) + '...');
    console.log('Refresh Token Length:', data.session.refresh_token.length);
    console.log('Refresh Token Preview:', data.session.refresh_token.substring(0, 50) + '...');
    
    // Check if tokens are JWT format
    const accessTokenParts = data.session.access_token.split('.');
    const refreshTokenParts = data.session.refresh_token.split('.');
    
    console.log('\n🔍 Token Structure:');
    console.log('Access Token Parts (JWT):', accessTokenParts.length);
    console.log('Refresh Token Parts:', refreshTokenParts.length);
    
    if (accessTokenParts.length === 3) {
      console.log('✅ Access token is JWT format');
      try {
        const payload = JSON.parse(atob(accessTokenParts[1]));
        console.log('JWT Payload preview:', {
          iss: payload.iss,
          sub: payload.sub,
          aud: payload.aud,
          exp: payload.exp,
          iat: payload.iat,
          email: payload.email,
          role: payload.role
        });
      } catch (e) {
        console.log('Could not decode JWT payload');
      }
    }
    
    // Create a realistic session object
    const realisticSession = {
      user: {
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.user_metadata.first_name,
        last_name: data.user.user_metadata.last_name,
        role: data.user.user_metadata.role
      },
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token
    };
    
    console.log('\n✨ Realistic Session Object:');
    console.log(JSON.stringify(realisticSession, null, 2));
    
    await supabase.auth.signOut();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  examineTokens().catch(console.error);
}

module.exports = { examineTokens };