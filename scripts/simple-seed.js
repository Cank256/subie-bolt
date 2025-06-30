const { createClient } = require('@supabase/supabase-js');

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

console.log('🔗 Connecting to Supabase...');
console.log(`URL: ${cleanUrl}`);
console.log(`Service Key: ${supabaseServiceKey.substring(0, 20)}...`);

const supabase = createClient(cleanUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function simpleSeed() {
  try {
    console.log('🌱 Starting simple database seeding...');
    
    // First, let's check if we can connect at all
    console.log('🔍 Testing basic connection...');
    
    // Try a simple query to test connection
    const { data: testData, error: testError } = await supabase
      .rpc('version');
    
    if (testError) {
      console.log('❌ Basic connection test failed:', testError.message);
      
      // Try alternative connection test
      console.log('🔄 Trying alternative connection test...');
      const { data: altData, error: altError } = await supabase
        .from('subscription_categories')
        .select('*')
        .limit(1);
      
      if (altError) {
        console.log('❌ Alternative test failed:', altError.message);
        
        if (altError.message.includes('does not exist')) {
          console.log('ℹ️  Table does not exist - migration needs to be run first');
          console.log('📋 Please run the migration manually:');
          console.log('1. Go to Supabase Dashboard > SQL Editor');
          console.log('2. Copy contents of supabase/migrations/20250629084806_humble_palace.sql');
          console.log('3. Paste and execute the SQL');
          console.log('4. Run this script again');
          return;
        }
      } else {
        console.log('✅ Alternative connection successful');
      }
    } else {
      console.log('✅ Basic connection successful');
    }
    
    // Check if categories table exists and has data
    console.log('📋 Checking subscription categories...');
    const { data: existingCategories, error: categoriesError } = await supabase
      .from('subscription_categories')
      .select('id, name')
      .limit(5);
    
    if (categoriesError) {
      console.error('❌ Error checking categories:', categoriesError.message);
      
      if (categoriesError.message.includes('does not exist')) {
        console.log('📋 Migration required - please run migration first');
        return;
      }
    } else if (existingCategories && existingCategories.length > 0) {
      console.log(`✅ Found ${existingCategories.length} existing categories:`);
      existingCategories.forEach(cat => console.log(`  - ${cat.name}`));
      console.log('📋 Categories already seeded, skipping...');
    } else {
      console.log('📝 Seeding subscription categories...');
      
      const categories = [
        { name: 'Entertainment', description: 'Streaming services, gaming, media', icon: 'tv', color: '#8B5CF6' },
        { name: 'Software', description: 'Productivity tools, development, business', icon: 'zap', color: '#3B82F6' },
        { name: 'Music', description: 'Music streaming and audio services', icon: 'music', color: '#10B981' },
        { name: 'News & Media', description: 'News, magazines, publications', icon: 'newspaper', color: '#F59E0B' },
        { name: 'Fitness & Health', description: 'Gym, wellness, health apps', icon: 'heart', color: '#EF4444' }
      ];
      
      const { data: insertedCategories, error: insertError } = await supabase
        .from('subscription_categories')
        .insert(categories)
        .select();
      
      if (insertError) {
        console.error('❌ Error inserting categories:', insertError.message);
      } else {
        console.log(`✅ Successfully inserted ${insertedCategories.length} categories`);
      }
    }
    
    console.log('🎉 Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    console.error('Stack trace:', error.stack);
  }
}

if (require.main === module) {
  simpleSeed().catch(console.error);
}

module.exports = { simpleSeed };