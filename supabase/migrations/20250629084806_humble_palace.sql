/*
  # Subie Database Schema Migration (Fixed)

  1. New Tables
    - `users` - User accounts and profiles
    - `subscription_categories` - Categories for organizing subscriptions
    - `subscriptions` - User subscriptions and services
    - `payment_methods` - User payment methods
    - `transactions` - Payment history and billing records
    - `notifications` - Notification preferences and history
    - `budgets` - User budget settings and limits
    - `analytics_snapshots` - Monthly spending analytics snapshots
    - `user_sessions` - User session management
    - `audit_logs` - System audit trail

  2. Security
    - Enable RLS on all tables
    - Add policies for user data isolation
    - Secure access patterns

  3. Indexes
    - Performance indexes for common queries
    - Foreign key indexes
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  phone text,
  first_name text,
  last_name text,
  avatar_url text,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  subscription_plan text DEFAULT 'free' CHECK (subscription_plan IN ('free', 'standard', 'premium')),
  plan_expires_at timestamptz,
  sms_credits integer DEFAULT 0,
  whatsapp_credits integer DEFAULT 0,
  timezone text DEFAULT 'UTC',
  currency text DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscription categories
CREATE TABLE IF NOT EXISTS subscription_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  icon text,
  color text,
  created_at timestamptz DEFAULT now()
);

-- Insert default categories
INSERT INTO subscription_categories (name, description, icon, color) VALUES
  ('Entertainment', 'Streaming services, gaming, media', 'tv', '#8B5CF6'),
  ('Software', 'Productivity tools, development, business', 'zap', '#3B82F6'),
  ('Music', 'Music streaming and audio services', 'music', '#10B981'),
  ('News & Media', 'News, magazines, publications', 'newspaper', '#F59E0B'),
  ('Fitness & Health', 'Gym, wellness, health apps', 'heart', '#EF4444'),
  ('Education', 'Learning platforms, courses', 'book-open', '#6366F1'),
  ('Finance', 'Banking, investment, financial tools', 'dollar-sign', '#059669'),
  ('Communication', 'Phone, internet, messaging', 'message-circle', '#DC2626'),
  ('Transportation', 'Car services, public transport', 'car', '#7C3AED'),
  ('Other', 'Miscellaneous subscriptions', 'more-horizontal', '#6B7280');

-- User subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES subscription_categories(id),
  name text NOT NULL,
  description text,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('weekly', 'monthly', 'quarterly', 'semi_annual', 'annual')),
  next_payment_date date NOT NULL,
  last_payment_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
  auto_renew boolean DEFAULT true,
  website_url text,
  logo_url text,
  notes text,
  reminder_days integer DEFAULT 3,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('credit_card', 'debit_card', 'bank_account', 'paypal', 'other')),
  provider text, -- stripe, paypal, etc.
  external_id text, -- provider's payment method ID
  last_four text,
  brand text, -- visa, mastercard, etc.
  expires_at date,
  is_primary boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transaction history
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  payment_method_id uuid REFERENCES payment_methods(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
  transaction_type text NOT NULL CHECK (transaction_type IN ('subscription_payment', 'refund', 'adjustment')),
  external_transaction_id text,
  provider text,
  description text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Notification preferences and history
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('payment_reminder', 'payment_failed', 'subscription_expired', 'price_change', 'weekly_summary')),
  channel text NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'push')),
  title text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  delivered_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- User notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_enabled boolean DEFAULT true,
  sms_enabled boolean DEFAULT false,
  whatsapp_enabled boolean DEFAULT false,
  push_enabled boolean DEFAULT true,
  payment_reminders boolean DEFAULT true,
  weekly_summary boolean DEFAULT true,
  price_change_alerts boolean DEFAULT true,
  reminder_days_before integer DEFAULT 3,
  quiet_hours_start time,
  quiet_hours_end time,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- User budgets
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES subscription_categories(id),
  name text NOT NULL,
  amount decimal(10,2) NOT NULL,
  period text NOT NULL CHECK (period IN ('weekly', 'monthly', 'quarterly', 'annual')),
  alert_threshold decimal(3,2) DEFAULT 0.80, -- Alert at 80% of budget
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analytics snapshots for performance
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL,
  total_monthly_spending decimal(10,2) NOT NULL,
  active_subscriptions integer NOT NULL,
  spending_by_category jsonb DEFAULT '{}',
  monthly_trend jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, snapshot_date)
);

-- User sessions for security
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  ip_address inet,
  user_agent text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions" ON subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Payment methods policies
CREATE POLICY "Users can view own payment methods" ON payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods" ON payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods" ON payment_methods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods" ON payment_methods
  FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notification preferences policies
CREATE POLICY "Users can view own notification preferences" ON notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences" ON notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences" ON notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Budgets policies
CREATE POLICY "Users can view own budgets" ON budgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets" ON budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets" ON budgets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets" ON budgets
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics snapshots policies
CREATE POLICY "Users can view own analytics" ON analytics_snapshots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON analytics_snapshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON user_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Audit logs policies (read-only for users)
CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Subscription categories are public (read-only)
CREATE POLICY "Anyone can view subscription categories" ON subscription_categories
  FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_payment ON subscriptions(next_payment_date) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_subscription_id ON transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_date ON analytics_snapshots(user_id, snapshot_date);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate next payment date
CREATE OR REPLACE FUNCTION calculate_next_payment_date(
  payment_date date,
  billing_cycle text
) RETURNS date AS $$
BEGIN
  CASE billing_cycle
    WHEN 'weekly' THEN
      RETURN payment_date + INTERVAL '1 week';
    WHEN 'monthly' THEN
      RETURN payment_date + INTERVAL '1 month';
    WHEN 'quarterly' THEN
      RETURN payment_date + INTERVAL '3 months';
    WHEN 'semi_annual' THEN
      RETURN payment_date + INTERVAL '6 months';
    WHEN 'annual' THEN
      RETURN payment_date + INTERVAL '1 year';
    ELSE
      RETURN payment_date + INTERVAL '1 month';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's monthly spending
CREATE OR REPLACE FUNCTION get_monthly_spending(
  p_user_id uuid,
  p_month date DEFAULT date_trunc('month', CURRENT_DATE)::date
) RETURNS decimal AS $$
DECLARE
  total_spending decimal(10,2) := 0;
BEGIN
  SELECT COALESCE(SUM(
    CASE s.billing_cycle
      WHEN 'weekly' THEN s.amount * 4.33
      WHEN 'monthly' THEN s.amount
      WHEN 'quarterly' THEN s.amount / 3
      WHEN 'semi_annual' THEN s.amount / 6
      WHEN 'annual' THEN s.amount / 12
      ELSE s.amount
    END
  ), 0) INTO total_spending
  FROM subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status = 'active';
  
  RETURN total_spending;
END;
$$ LANGUAGE plpgsql;