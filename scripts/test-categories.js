require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCategories() {
  console.log('🔍 Testing subscription_categories table...');
  
  try {
    // Test basic table access
    const { data: categories, error: categoriesError } = await supabase
      .from('subscription_categories')
      .select('*');
    
    if (categoriesError) {
      console.error('❌ Error accessing subscription_categories:', categoriesError);
    } else {
      console.log('✅ subscription_categories data:', categories);
    }
    
    // Test the corrected query - use 'name' instead of 'category'
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*, subscription_categories(name)');
    
    if (subscriptionsError) {
      console.error('❌ Error with subscriptions + categories join:', subscriptionsError);
    } else {
      console.log('✅ Subscriptions with categories:', subscriptions);
    }
    
    // Test subscriptions table structure
    const { data: subs, error: subsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
    
    if (subsError) {
      console.error('❌ Error accessing subscriptions:', subsError);
    } else {
      console.log('✅ Sample subscription:', subs?.[0]);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testCategories();