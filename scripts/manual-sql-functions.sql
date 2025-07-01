-- Manual SQL script to create admin functions
-- Run this in your Supabase SQL Editor

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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;