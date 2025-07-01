const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixAdminUser() {
  try {
    console.log('🔧 Fixing admin user issues...');
    
    const adminUserId = '53f1d379-e99a-405e-be51-8972d18f7665';
    const adminEmail = 'admin@subie.com';
    
    // First, check for existing users with this ID
    console.log('🔍 Checking for existing user records...');
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', adminUserId);
    
    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError.message);
      return;
    }
    
    console.log(`📊 Found ${existingUsers.length} user records with ID ${adminUserId}`);
    
    if (existingUsers.length > 1) {
      console.log('🧹 Removing duplicate user records...');
      
      // Keep the first one, delete the rest
      for (let i = 1; i < existingUsers.length; i++) {
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('id', adminUserId)
          .eq('created_at', existingUsers[i].created_at);
        
        if (deleteError) {
          console.error(`❌ Error deleting duplicate ${i}:`, deleteError.message);
        } else {
          console.log(`✅ Deleted duplicate user record ${i}`);
        }
      }
    }
    
    // Now check if we have exactly one user
    const { data: finalUsers, error: finalFetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', adminUserId);
    
    if (finalFetchError) {
      console.error('❌ Error in final fetch:', finalFetchError.message);
      return;
    }
    
    if (finalUsers.length === 0) {
      console.log('👤 No user record found. Creating admin user...');
      
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: adminUserId,
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
        console.error('❌ Error creating user:', createError.message);
        return;
      }
      
      console.log('✅ Created admin user:', newUser);
    } else if (finalUsers.length === 1) {
      const user = finalUsers[0];
      console.log('👤 Found single user record:', user);
      
      // Ensure the role is admin
      if (user.role !== 'admin') {
        console.log('🔧 Updating role to admin...');
        
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', adminUserId)
          .select()
          .single();
        
        if (updateError) {
          console.error('❌ Error updating role:', updateError.message);
        } else {
          console.log('✅ Updated user role to admin:', updatedUser);
        }
      } else {
        console.log('✅ User already has admin role');
      }
    }
    
    // Final verification
    console.log('\n🧪 Final verification...');
    const { data: verifyUser, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('id', adminUserId)
      .single();
    
    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
    } else {
      console.log('✅ Admin user verified:');
      console.log('  - ID:', verifyUser.id);
      console.log('  - Email:', verifyUser.email);
      console.log('  - Role:', verifyUser.role);
      console.log('  - Name:', `${verifyUser.first_name} ${verifyUser.last_name}`);
      console.log('  - Is Admin:', verifyUser.role === 'admin');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixAdminUser();