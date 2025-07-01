const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugAdminAccess() {
  try {
    console.log('🔍 Debugging admin access issue...');
    
    // First, let's sign in as admin to get the session
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@subie.com',
      password: 'admin123!'
    });
    
    if (authError) {
      console.error('❌ Auth error:', authError.message);
      return;
    }
    
    console.log('✅ Successfully signed in as admin');
    console.log('📋 User metadata role:', authData.user.user_metadata?.role);
    console.log('👤 User ID:', authData.user.id);
    
    // Now check if user exists in users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Error fetching user profile:', profileError.message);
      
      if (profileError.code === 'PGRST116') {
        console.log('🔧 User not found in users table. Creating profile...');
        
        // Create user profile with admin role
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            first_name: authData.user.user_metadata?.first_name || 'Admin',
            last_name: authData.user.user_metadata?.last_name || 'User',
            role: authData.user.user_metadata?.role || 'admin',
            email_verified: true,
            subscription_plan: 'premium',
            sms_credits: 1000,
            whatsapp_credits: 1000,
            timezone: 'UTC',
            currency: 'USD'
          })
          .select()
          .single();
        
        if (createError) {
          console.error('❌ Error creating user profile:', createError.message);
        } else {
          console.log('✅ Created user profile:', newProfile);
        }
      }
    } else {
      console.log('✅ User profile found:', userProfile);
      console.log('📋 Database role:', userProfile.role);
      
      // Check if roles match
      const jwtRole = authData.user.user_metadata?.role;
      const dbRole = userProfile.role;
      
      if (jwtRole !== dbRole) {
        console.log(`🔧 Role mismatch! JWT: ${jwtRole}, DB: ${dbRole}`);
        console.log('🔧 Updating database role to match JWT...');
        
        const { data: updatedProfile, error: updateError } = await supabase
          .from('users')
          .update({ role: jwtRole })
          .eq('id', authData.user.id)
          .select()
          .single();
        
        if (updateError) {
          console.error('❌ Error updating role:', updateError.message);
        } else {
          console.log('✅ Updated user role:', updatedProfile);
        }
      } else {
        console.log('✅ Roles match - no update needed');
      }
    }
    
    // Test the auth flow
    console.log('\n🧪 Testing auth flow...');
    
    // Get fresh session
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      const userId = sessionData.session.user.id;
      
      // Fetch profile again
      const { data: finalProfile, error: finalError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (finalError) {
        console.error('❌ Final profile fetch error:', finalError.message);
      } else {
        console.log('✅ Final profile check:');
        console.log('  - Email:', finalProfile.email);
        console.log('  - Role:', finalProfile.role);
        console.log('  - Is Admin:', finalProfile.role === 'admin');
        console.log('  - Has Admin Access:', ['admin', 'moderator'].includes(finalProfile.role));
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugAdminAccess();