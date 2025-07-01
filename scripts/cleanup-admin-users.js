const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupAdminUsers() {
  try {
    console.log('🧹 Cleaning up admin user records...');
    
    const adminEmail = 'admin@subie.com';
    const correctAdminId = '53f1d379-e99a-405e-be51-8972d18f7665';
    
    // Find all users with admin email
    console.log('🔍 Finding all users with admin email...');
    const { data: adminUsers, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail);
    
    if (fetchError) {
      console.error('❌ Error fetching admin users:', fetchError.message);
      return;
    }
    
    console.log(`📊 Found ${adminUsers.length} users with email ${adminEmail}:`);
    adminUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user.id}, Role: ${user.role}, Created: ${user.created_at}`);
    });
    
    // Delete all admin users that don't have the correct ID
    const usersToDelete = adminUsers.filter(user => user.id !== correctAdminId);
    
    if (usersToDelete.length > 0) {
      console.log(`🗑️ Deleting ${usersToDelete.length} incorrect admin user(s)...`);
      
      for (const user of usersToDelete) {
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('id', user.id);
        
        if (deleteError) {
          console.error(`❌ Error deleting user ${user.id}:`, deleteError.message);
        } else {
          console.log(`✅ Deleted user ${user.id}`);
        }
      }
    }
    
    // Check if the correct admin user exists
    const correctAdminUser = adminUsers.find(user => user.id === correctAdminId);
    
    if (!correctAdminUser) {
      console.log('👤 Creating correct admin user...');
      
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: correctAdminId,
          email: adminEmail,
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          email_verified: true,
          phone_verified: false,
          subscription_plan: 'premium',
          sms_credits: 1000,
          whatsapp_credits: 1000,
          timezone: 'UTC',
          currency: 'USD'
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Error creating correct admin user:', createError.message);
      } else {
        console.log('✅ Created correct admin user:', newUser);
      }
    } else {
      console.log('✅ Correct admin user already exists');
      
      // Ensure the role is admin
      if (correctAdminUser.role !== 'admin') {
        console.log('🔧 Updating role to admin...');
        
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', correctAdminId)
          .select()
          .single();
        
        if (updateError) {
          console.error('❌ Error updating role:', updateError.message);
        } else {
          console.log('✅ Updated user role to admin:', updatedUser);
        }
      }
    }
    
    // Final verification
    console.log('\n🧪 Final verification...');
    const { data: finalUser, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('id', correctAdminId)
      .single();
    
    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
    } else {
      console.log('✅ Admin user verified:');
      console.log('  - ID:', finalUser.id);
      console.log('  - Email:', finalUser.email);
      console.log('  - Role:', finalUser.role);
      console.log('  - Name:', `${finalUser.first_name} ${finalUser.last_name}`);
      console.log('  - Is Admin:', finalUser.role === 'admin');
    }
    
    // Test the auth flow
    console.log('\n🧪 Testing auth flow with anon key...');
    
    // Create client with anon key (like frontend)
    const anonSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Sign in
    const { data: authData, error: authError } = await anonSupabase.auth.signInWithPassword({
      email: adminEmail,
      password: 'admin123!'
    });
    
    if (authError) {
      console.error('❌ Auth test failed:', authError.message);
    } else {
      console.log('✅ Auth test successful');
      
      // Try to fetch profile with anon key
      const { data: profileData, error: profileError } = await anonSupabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError) {
        console.error('❌ Profile fetch with anon key failed:', profileError.message);
        console.log('💡 This might be due to RLS policies. The frontend should handle this.');
      } else {
        console.log('✅ Profile fetch successful:', profileData);
      }
      
      // Sign out
      await anonSupabase.auth.signOut();
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

cleanupAdminUsers();