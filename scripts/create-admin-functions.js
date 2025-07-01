const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminFunctions() {
  console.log('🔧 Creating admin functions...');
  
  try {
    // Create is_admin function
    console.log('Creating is_admin function...');
    const { data: isAdminResult, error: isAdminError } = await supabase.rpc('exec', {
      sql: `
        CREATE OR REPLACE FUNCTION is_admin(user_id uuid DEFAULT auth.uid())
        RETURNS boolean AS $$
        BEGIN
          RETURN EXISTS (
            SELECT 1 FROM users WHERE id = user_id AND role = 'admin'
          );
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (isAdminError) {
      console.log('❌ Error creating is_admin function:', isAdminError);
      // Try alternative approach using direct SQL execution
      console.log('Trying alternative approach...');
      
      // Use the SQL editor approach
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          sql: `
            CREATE OR REPLACE FUNCTION is_admin(user_id uuid DEFAULT auth.uid())
            RETURNS boolean AS $$
            BEGIN
              RETURN EXISTS (
                SELECT 1 FROM users WHERE id = user_id AND role = 'admin'
              );
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
          `
        })
      });
      
      if (!response.ok) {
        console.log('Alternative approach also failed. Let\'s try creating the function manually...');
        
        // Manual function creation using a workaround
        console.log('Creating functions using SQL statements...');
        
        // Since we can't use exec, let's create a simple version that works with the existing setup
        console.log('✅ Functions will be created through database migration.');
        console.log('Please run the following SQL in your Supabase SQL editor:');
        console.log(`
-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get system stats for admin dashboard
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM users),
    'active_users', (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days'),
    'total_subscriptions', (SELECT COUNT(*) FROM subscriptions),
    'active_subscriptions', (SELECT COUNT(*) FROM subscriptions WHERE status = 'active'),
    'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE status = 'completed'),
    'monthly_revenue', (
      SELECT COALESCE(SUM(amount), 0) 
      FROM transactions 
      WHERE status = 'completed' 
      AND created_at >= date_trunc('month', CURRENT_DATE)
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`);
        
        return;
      }
    } else {
      console.log('✅ is_admin function created successfully');
    }
    
    // Create get_admin_stats function
    console.log('Creating get_admin_stats function...');
    const { data: statsResult, error: statsError } = await supabase.rpc('exec', {
      sql: `
        CREATE OR REPLACE FUNCTION get_admin_stats()
        RETURNS json AS $$
        DECLARE
          result json;
        BEGIN
          -- Check if current user is admin
          IF NOT is_admin() THEN
            RAISE EXCEPTION 'Access denied. Admin privileges required.';
          END IF;

          SELECT json_build_object(
            'total_users', (SELECT COUNT(*) FROM users),
            'active_users', (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days'),
            'total_subscriptions', (SELECT COUNT(*) FROM subscriptions),
            'active_subscriptions', (SELECT COUNT(*) FROM subscriptions WHERE status = 'active'),
            'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE status = 'completed'),
            'monthly_revenue', (
              SELECT COALESCE(SUM(amount), 0) 
              FROM transactions 
              WHERE status = 'completed' 
              AND created_at >= date_trunc('month', CURRENT_DATE)
            )
          ) INTO result;

          RETURN result;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (statsError) {
      console.log('❌ Error creating get_admin_stats function:', statsError);
    } else {
      console.log('✅ get_admin_stats function created successfully');
    }
    
    // Test the function
    console.log('\n🧪 Testing get_admin_stats function...');
    const { data: testData, error: testError } = await supabase.rpc('get_admin_stats');
    
    if (testError) {
      console.log('❌ Error testing get_admin_stats:', testError);
    } else {
      console.log('✅ get_admin_stats test result:', testData);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

createAdminFunctions();