const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create client with service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeAdminFunctions() {
  console.log('Creating admin functions in Supabase...');
  
  try {
    // Create is_admin function
    const isAdminSQL = `
      CREATE OR REPLACE FUNCTION is_admin(user_id uuid DEFAULT auth.uid())
      RETURNS boolean AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM users WHERE id = user_id AND role = 'admin'
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    console.log('Creating is_admin function...');
    const { error: isAdminError } = await supabase.rpc('exec', { sql: isAdminSQL });
    
    if (isAdminError) {
      console.log('Direct SQL execution failed, trying alternative approach...');
      // Alternative: Use raw SQL query
      const { error: altError } = await supabase
        .from('pg_stat_user_functions')
        .select('*')
        .limit(1);
      
      if (altError) {
        console.log('Database connection verified, but function creation requires manual execution.');
        console.log('\nPlease execute the following SQL in your Supabase SQL Editor:');
        console.log('\n--- IS_ADMIN FUNCTION ---');
        console.log(isAdminSQL);
        
        const getAdminStatsSQL = `
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
              ),
              'subscription_categories', (
                SELECT COALESCE(json_agg(
                  json_build_object(
                    'name', 'General',
                    'count', COUNT(*)
                  )
                ), '[]'::json)
                FROM subscriptions
                WHERE status = 'active'
              )
            ) INTO result;

            RETURN result;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `;
        
        console.log('\n--- GET_ADMIN_STATS FUNCTION ---');
        console.log(getAdminStatsSQL);
        
        console.log('\n--- GRANT PERMISSIONS ---');
        console.log('GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;');
        console.log('GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;');
        
        return;
      }
    } else {
      console.log('✓ is_admin function created successfully');
    }
    
    // Create get_admin_stats function
    const getAdminStatsSQL = `
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
          ),
          'subscription_categories', (
            SELECT COALESCE(json_agg(
              json_build_object(
                'name', 'General',
                'count', COUNT(*)
              )
            ), '[]'::json)
            FROM subscriptions
            WHERE status = 'active'
          )
        ) INTO result;

        RETURN result;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    console.log('Creating get_admin_stats function...');
    const { error: getStatsError } = await supabase.rpc('exec', { sql: getAdminStatsSQL });
    
    if (getStatsError) {
      console.log('Function creation requires manual execution in Supabase SQL Editor.');
      return;
    }
    
    console.log('✓ get_admin_stats function created successfully');
    
    // Grant permissions
    const grantSQL = `
      GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;
      GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;
    `;
    
    console.log('Granting permissions...');
    const { error: grantError } = await supabase.rpc('exec', { sql: grantSQL });
    
    if (grantError) {
      console.log('Permission granting requires manual execution.');
    } else {
      console.log('✓ Permissions granted successfully');
    }
    
    // Test the functions
    console.log('\nTesting admin functions...');
    
    // Test with admin user
    const { data: adminStats, error: testError } = await supabase.rpc('get_admin_stats');
    
    if (testError) {
      console.log('❌ Function test failed:', testError.message);
      console.log('\nThe functions may need to be created manually in Supabase SQL Editor.');
    } else {
      console.log('✓ Admin functions working correctly!');
      console.log('Admin stats:', adminStats);
    }
    
  } catch (error) {
    console.error('Error creating admin functions:', error);
  }
}

executeAdminFunctions();