require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUserPasswords() {
  try {
    console.log('Checking existing users and their password hashes...');
    
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, password_hash');
    
    if (usersError) {
      console.error('Error querying users:', usersError);
      return;
    }
    
    console.log('Found users:', users.map(u => ({ email: u.email, hasPassword: !!u.password_hash })));
    
    // Update users without password hashes
    for (const user of users) {
      if (!user.password_hash) {
        let password;
        if (user.email === 'admin@subie.com') {
          password = 'admin123!';
        } else if (user.email === 'user@subie.com') {
          password = 'user123!';
        } else {
          console.log(`Skipping user ${user.email} - no default password defined`);
          continue;
        }
        
        console.log(`Updating password for ${user.email}...`);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { error: updateError } = await supabase
          .from('users')
          .update({ password_hash: hashedPassword })
          .eq('id', user.id);
        
        if (updateError) {
          console.error(`Error updating password for ${user.email}:`, updateError);
        } else {
          console.log(`✅ Password updated for ${user.email}`);
        }
      } else {
        console.log(`✅ ${user.email} already has a password hash`);
      }
    }
    
    console.log('\n🔑 Login credentials:');
    console.log('Admin: admin@subie.com / admin123!');
    console.log('User: user@subie.com / user123!');
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

updateUserPasswords();