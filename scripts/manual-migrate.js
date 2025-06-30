const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTables() {
  try {
    console.log('🚀 Starting manual table creation...');
    
    // First, let's check what tables already exist
    console.log('🔍 Checking existing tables...');
    
    // Try to query each table to see if it exists
    const tables = [
      'users',
      'subscription_categories', 
      'subscriptions',
      'payment_methods',
      'transactions',
      'notifications',
      'notification_preferences',
      'budgets',
      'analytics_snapshots',
      'user_sessions',
      'audit_logs'
    ];
    
    for (const tableName of tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${tableName}' does not exist:`, error.message);
        } else {
          console.log(`✅ Table '${tableName}' exists`);
        }
      } catch (err) {
        console.log(`❌ Table '${tableName}' check failed:`, err.message);
      }
    }
    
    console.log('\n📋 Migration Summary:');
    console.log('The tables need to be created in your Supabase dashboard.');
    console.log('Please follow these steps:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the contents of supabase/migrations/20250629081632_wispy_sea.sql');
    console.log('4. Execute the SQL script');
    console.log('5. Run this script again to verify tables were created');
    
  } catch (error) {
    console.error('❌ Migration check failed:', error);
  }
}

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');
    
    // Check if subscription_categories table exists and seed it
    const { data: existingCategories, error: categoriesError } = await supabase
      .from('subscription_categories')
      .select('id')
      .limit(1);
    
    if (categoriesError) {
      console.error('❌ Cannot access subscription_categories table:', categoriesError.message);
      console.log('Please ensure the migration has been run first.');
      return;
    }
    
    if (existingCategories && existingCategories.length > 0) {
      console.log('📋 Categories already exist, skipping seed');
    } else {
      // Seed subscription categories
      const categories = [
        {
          name: 'Entertainment',
          description: 'Streaming services, gaming, media',
          icon: 'tv',
          color: '#8B5CF6'
        },
        {
          name: 'Software',
          description: 'Productivity tools, development, business',
          icon: 'zap',
          color: '#3B82F6'
        },
        {
          name: 'Music',
          description: 'Music streaming and audio services',
          icon: 'music',
          color: '#10B981'
        },
        {
          name: 'News & Media',
          description: 'News, magazines, publications',
          icon: 'newspaper',
          color: '#F59E0B'
        },
        {
          name: 'Fitness & Health',
          description: 'Gym, wellness, health apps',
          icon: 'heart',
          color: '#EF4444'
        },
        {
          name: 'Education',
          description: 'Learning platforms, courses',
          icon: 'book-open',
          color: '#6366F1'
        },
        {
          name: 'Finance',
          description: 'Banking, investment, financial tools',
          icon: 'dollar-sign',
          color: '#059669'
        },
        {
          name: 'Communication',
          description: 'Phone, internet, messaging',
          icon: 'message-circle',
          color: '#DC2626'
        },
        {
          name: 'Transportation',
          description: 'Car services, public transport',
          icon: 'car',
          color: '#7C3AED'
        },
        {
          name: 'Other',
          description: 'Miscellaneous subscriptions',
          icon: 'more-horizontal',
          color: '#6B7280'
        }
      ];
      
      console.log('📝 Inserting subscription categories...');
      const { data: insertedCategories, error: insertError } = await supabase
        .from('subscription_categories')
        .insert(categories)
        .select();
      
      if (insertError) {
        console.error('❌ Error inserting categories:', insertError);
      } else {
        console.log(`✅ Inserted ${insertedCategories.length} categories`);
      }
    }
    
    console.log('🎉 Seeding completed!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

async function main() {
  await createTables();
  console.log('\n' + '='.repeat(50) + '\n');
  await seedData();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createTables, seedData };