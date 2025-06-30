const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Clean URL (remove trailing slash)
const cleanUrl = supabaseUrl.replace(/\/$/, '');

// Validate URL format
try {
  new URL(cleanUrl);
  console.log('✅ Supabase URL format is valid');
} catch (error) {
  console.error('❌ Invalid Supabase URL format:', cleanUrl);
  console.error('Please check your NEXT_PUBLIC_SUPABASE_URL in .env file');
  process.exit(1);
}

const supabase = createClient(cleanUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        console.error('❌ Network fetch failed:', err.message);
        console.error('This usually indicates:');
        console.error('1. Network connectivity issues');
        console.error('2. Incorrect Supabase URL');
        console.error('3. Supabase project is paused or inactive');
        console.error('4. Firewall blocking the connection');
        throw err;
      });
    }
  }
});

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connectivity first
    const response = await fetch(`${cleanUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log('✅ Basic HTTP connectivity successful');
    
    // Test database connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && !error.message.includes('does not exist')) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    
    console.log('✅ Database connection successful');
    return true;
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Verify your Supabase project URL in .env file');
    console.error('2. Check that your service role key is correct');
    console.error('3. Ensure your Supabase project is active (not paused)');
    console.error('4. Check your internet connection');
    console.error('5. Try running: npm run diagnose');
    return false;
  }
}

async function seedUsers() {
  try {
    console.log('👥 Starting user seeding...');
    
    // Test connection first
    const connectionOk = await testConnection();
    if (!connectionOk) {
      console.error('❌ Cannot proceed with seeding due to connection issues');
      process.exit(1);
    }
    
    // Check if users table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (tableError && tableError.message.includes('does not exist')) {
      console.error('❌ Users table does not exist');
      console.error('Please run the database migration first: npm run migrate');
      process.exit(1);
    }
    
    // Check if users already exist
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('email')
      .in('email', ['admin@subie.com', 'user@subie.com']);
    
    if (checkError) {
      console.error('❌ Error checking existing users:', checkError.message);
      process.exit(1);
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('📋 Users already exist, skipping seed');
      console.log('Existing users:', existingUsers.map(u => u.email).join(', '));
      return;
    }
    
    // Create admin user
    console.log('👑 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123!', 10);
    const adminUser = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'admin@subie.com',
      password_hash: adminPassword,
      first_name: 'Admin',
      last_name: 'User',
      subscription_plan: 'premium',
      email_verified: true,
      sms_credits: 1000,
      whatsapp_credits: 1000,
      timezone: 'UTC',
      currency: 'USD'
    };
    
    const { error: adminError } = await supabase
      .from('users')
      .insert(adminUser);
    
    if (adminError) {
      console.error('❌ Error creating admin user:', adminError.message);
      throw adminError;
    } else {
      console.log('✅ Admin user created successfully');
    }
    
    // Create normal user
    console.log('👤 Creating normal user...');
    const userPassword = await bcrypt.hash('user123!', 10);
    const normalUser = {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'user@subie.com',
      password_hash: userPassword,
      first_name: 'John',
      last_name: 'Doe',
      subscription_plan: 'standard',
      email_verified: true,
      sms_credits: 50,
      whatsapp_credits: 50,
      timezone: 'America/New_York',
      currency: 'USD'
    };
    
    const { error: userError } = await supabase
      .from('users')
      .insert(normalUser);
    
    if (userError) {
      console.error('❌ Error creating normal user:', userError.message);
      throw userError;
    } else {
      console.log('✅ Normal user created successfully');
    }
    
    // Get subscription categories for demo subscriptions
    const { data: categories, error: categoriesError } = await supabase
      .from('subscription_categories')
      .select('id, name');
    
    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError.message);
      console.log('⚠️  Skipping demo subscriptions due to categories error');
    } else if (categories && categories.length > 0) {
      console.log('📱 Creating demo subscriptions for normal user...');
      
      const entertainmentCategory = categories.find(c => c.name === 'Entertainment');
      const musicCategory = categories.find(c => c.name === 'Music');
      const softwareCategory = categories.find(c => c.name === 'Software');
      
      const demoSubscriptions = [
        {
          user_id: normalUser.id,
          category_id: entertainmentCategory?.id,
          name: 'Netflix',
          amount: 15.99,
          billing_cycle: 'monthly',
          next_payment_date: '2025-02-15',
          status: 'active'
        },
        {
          user_id: normalUser.id,
          category_id: musicCategory?.id,
          name: 'Spotify Premium',
          amount: 9.99,
          billing_cycle: 'monthly',
          next_payment_date: '2025-02-10',
          status: 'active'
        },
        {
          user_id: normalUser.id,
          category_id: softwareCategory?.id,
          name: 'Adobe Creative Suite',
          amount: 52.99,
          billing_cycle: 'monthly',
          next_payment_date: '2025-02-20',
          status: 'active'
        },
        {
          user_id: normalUser.id,
          category_id: entertainmentCategory?.id,
          name: 'YouTube Premium',
          amount: 11.99,
          billing_cycle: 'monthly',
          next_payment_date: '2025-02-05',
          status: 'active'
        }
      ];
      
      const { error: subscriptionsError } = await supabase
        .from('subscriptions')
        .insert(demoSubscriptions);
      
      if (subscriptionsError) {
        console.error('❌ Error creating demo subscriptions:', subscriptionsError.message);
        console.log('⚠️  Continuing without demo subscriptions');
      } else {
        console.log('✅ Demo subscriptions created successfully');
      }
      
      // Create notification preferences for both users
      console.log('🔔 Creating notification preferences...');
      
      const notificationPreferences = [
        {
          user_id: adminUser.id,
          email_enabled: true,
          sms_enabled: true,
          whatsapp_enabled: true,
          push_enabled: true,
          payment_reminders: true,
          weekly_summary: true,
          price_change_alerts: true,
          reminder_days_before: 3
        },
        {
          user_id: normalUser.id,
          email_enabled: true,
          sms_enabled: false,
          whatsapp_enabled: false,
          push_enabled: true,
          payment_reminders: true,
          weekly_summary: true,
          price_change_alerts: true,
          reminder_days_before: 3
        }
      ];
      
      const { error: prefsError } = await supabase
        .from('notification_preferences')
        .insert(notificationPreferences);
      
      if (prefsError) {
        console.error('❌ Error creating notification preferences:', prefsError.message);
        console.log('⚠️  Continuing without notification preferences');
      } else {
        console.log('✅ Notification preferences created successfully');
      }
      
      // Create some sample transactions for the normal user
      console.log('💳 Creating sample transactions...');
      
      const sampleTransactions = [
        {
          user_id: normalUser.id,
          subscription_id: null, // We'd need to get the actual subscription IDs
          amount: 15.99,
          currency: 'USD',
          status: 'completed',
          transaction_type: 'subscription_payment',
          description: 'Netflix monthly payment',
          processed_at: '2025-01-15T10:00:00Z'
        },
        {
          user_id: normalUser.id,
          subscription_id: null,
          amount: 9.99,
          currency: 'USD',
          status: 'completed',
          transaction_type: 'subscription_payment',
          description: 'Spotify Premium monthly payment',
          processed_at: '2025-01-10T10:00:00Z'
        },
        {
          user_id: normalUser.id,
          subscription_id: null,
          amount: 52.99,
          currency: 'USD',
          status: 'completed',
          transaction_type: 'subscription_payment',
          description: 'Adobe Creative Suite monthly payment',
          processed_at: '2025-01-01T10:00:00Z'
        }
      ];
      
      const { error: transactionsError } = await supabase
        .from('transactions')
        .insert(sampleTransactions);
      
      if (transactionsError) {
        console.error('❌ Error creating sample transactions:', transactionsError.message);
        console.log('⚠️  Continuing without sample transactions');
      } else {
        console.log('✅ Sample transactions created successfully');
      }
    } else {
      console.log('⚠️  No subscription categories found, skipping demo data');
    }
    
    console.log('\n🎉 User seeding completed!');
    console.log('\n📋 Created Users:');
    console.log('👑 Admin User:');
    console.log('   Email: admin@subie.com');
    console.log('   Password: admin123!');
    console.log('   Plan: Premium');
    console.log('   ID: 11111111-1111-1111-1111-111111111111');
    console.log('\n👤 Normal User:');
    console.log('   Email: user@subie.com');
    console.log('   Password: user123!');
    console.log('   Plan: Standard');
    console.log('   ID: 22222222-2222-2222-2222-222222222222');
    console.log('   Subscriptions: 4 demo subscriptions (if categories exist)');
    console.log('\n💡 Note: These are database records only.');
    console.log('   To actually log in, you\'ll need to create auth accounts');
    console.log('   through the Supabase Auth system or your app\'s signup flow.');
    
  } catch (error) {
    console.error('❌ User seeding failed:', error);
    console.error('\n🔧 If this is a connection error, try:');
    console.error('1. npm run diagnose (to test your connection)');
    console.error('2. Check your .env file for correct Supabase credentials');
    console.error('3. Verify your Supabase project is active');
    process.exit(1);
  }
}

if (require.main === module) {
  seedUsers().catch(console.error);
}

module.exports = { seedUsers };