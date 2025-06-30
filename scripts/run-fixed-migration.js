const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function runFixedMigration() {
  try {
    console.log('🚀 Running fixed migration...');
    
    // Read the fixed migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20250629081632_wispy_sea_fixed.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Fixed migration file not found:', migrationPath);
      process.exit(1);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📝 Executing fixed migration SQL...');
    console.log('⚠️  Note: This will be executed via Supabase REST API');
    
    // Since we can't execute raw SQL directly through the JS client,
    // we'll provide instructions for manual execution
    console.log('\n📋 MANUAL EXECUTION REQUIRED:');
    console.log('1. Copy the contents of: supabase/migrations/20250629081632_wispy_sea_fixed.sql');
    console.log('2. Go to your Supabase Dashboard > SQL Editor');
    console.log('3. Paste the SQL and click "Run"');
    console.log('4. Come back and run: npm run seed');
    
    // Try to check if tables exist to verify migration status
    console.log('\n🔍 Checking current database state...');
    
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
    
    let existingTables = [];
    
    for (const tableName of tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!error) {
          existingTables.push(tableName);
        }
      } catch (err) {
        // Table doesn't exist
      }
    }
    
    if (existingTables.length > 0) {
      console.log(`✅ Found existing tables: ${existingTables.join(', ')}`);
      console.log('🎉 Migration appears to have been run already!');
      
      // Run seeding
      console.log('\n🌱 Running seeding...');
      const { seedDatabase } = require('./seed.js');
      await seedDatabase();
    } else {
      console.log('❌ No tables found. Please run the migration manually as instructed above.');
    }
    
  } catch (error) {
    console.error('❌ Migration check failed:', error);
  }
}

if (require.main === module) {
  runFixedMigration().catch(console.error);
}

module.exports = { runFixedMigration };