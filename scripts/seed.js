const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

// Clean URL (remove trailing slash)
const cleanUrl = supabaseUrl.replace(/\/$/, '');

const supabase = createClient(cleanUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Check if categories already exist
    const { data: existingCategories } = await supabase
      .from('subscription_categories')
      .select('id')
      .limit(1);
    
    if (existingCategories && existingCategories.length > 0) {
      console.log('📋 Categories already exist, skipping seed');
      return;
    }
    
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
    const { data: insertedCategories, error: categoriesError } = await supabase
      .from('subscription_categories')
      .insert(categories)
      .select();
    
    if (categoriesError) {
      console.error('❌ Error inserting categories:', categoriesError);
    } else {
      console.log(`✅ Inserted ${insertedCategories.length} categories`);
    }
    
    // Optional: Create a demo user and subscriptions
    console.log('👤 Creating demo user...');
    const demoUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'demo@subie.com',
      first_name: 'Demo',
      last_name: 'User',
      subscription_plan: 'standard'
    };
    
    const { error: userError } = await supabase
      .from('users')
      .upsert(demoUser);
    
    if (userError) {
      console.error('❌ Error creating demo user:', userError);
    } else {
      console.log('✅ Demo user created');
      
      // Add demo subscriptions
      if (insertedCategories && insertedCategories.length > 0) {
        const entertainmentCategory = insertedCategories.find(c => c.name === 'Entertainment');
        const musicCategory = insertedCategories.find(c => c.name === 'Music');
        const softwareCategory = insertedCategories.find(c => c.name === 'Software');
        
        const demoSubscriptions = [
          {
            user_id: demoUser.id,
            category_id: entertainmentCategory?.id,
            name: 'Netflix',
            amount: 15.99,
            billing_cycle: 'monthly',
            next_payment_date: '2025-02-15'
          },
          {
            user_id: demoUser.id,
            category_id: musicCategory?.id,
            name: 'Spotify Premium',
            amount: 9.99,
            billing_cycle: 'monthly',
            next_payment_date: '2025-02-10'
          },
          {
            user_id: demoUser.id,
            category_id: softwareCategory?.id,
            name: 'Adobe Creative Suite',
            amount: 52.99,
            billing_cycle: 'monthly',
            next_payment_date: '2025-02-20'
          }
        ];
        
        console.log('📱 Creating demo subscriptions...');
        const { error: subscriptionsError } = await supabase
          .from('subscriptions')
          .insert(demoSubscriptions);
        
        if (subscriptionsError) {
          console.error('❌ Error creating demo subscriptions:', subscriptionsError);
        } else {
          console.log('✅ Demo subscriptions created');
        }
        
        // Create notification preferences for demo user
        const { error: prefsError } = await supabase
          .from('notification_preferences')
          .insert({ user_id: demoUser.id });
        
        if (prefsError) {
          console.error('❌ Error creating notification preferences:', prefsError);
        } else {
          console.log('✅ Notification preferences created');
        }
      }
    }
    
    console.log('🎉 Database seeding completed!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = { seedDatabase };