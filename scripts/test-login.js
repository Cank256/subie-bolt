require('dotenv').config();
const { auth } = require('../lib/supabase/auth.ts');

async function testLogin() {
  try {
    console.log('Testing login with admin@subie.com...');
    const result = await auth.signIn('admin@subie.com', 'admin123!');
    console.log('✅ Login successful!');
    console.log('User:', result.user);
    console.log('Session token:', result.session.access_token);
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    console.error('Full error:', error);
  }

  try {
    console.log('\nTesting login with user@subie.com...');
    const result = await auth.signIn('user@subie.com', 'user123!');
    console.log('✅ Login successful!');
    console.log('User:', result.user);
    console.log('Session token:', result.session.access_token);
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    console.error('Full error:', error);
  }

  try {
    console.log('\nTesting login with wrong password...');
    const result = await auth.signIn('admin@subie.com', 'wrongpassword');
    console.log('✅ Login successful (this should not happen!):', result);
  } catch (error) {
    console.log('✅ Login correctly failed with wrong password:', error.message);
  }

  try {
    console.log('\nTesting login with non-existent user...');
    const result = await auth.signIn('nonexistent@subie.com', 'password');
    console.log('✅ Login successful (this should not happen!):', result);
  } catch (error) {
    console.log('✅ Login correctly failed with non-existent user:', error.message);
  }
}

testLogin();