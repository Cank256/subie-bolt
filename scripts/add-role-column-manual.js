const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('- SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addRoleColumn() {
  console.log('🔧 Adding role column to users table...')
  
  try {
    // First, check if the role column already exists
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'users')
      .eq('table_schema', 'public')
    
    if (columnError) {
      console.log('⚠️  Could not check existing columns, proceeding with manual steps...')
    } else {
      const hasRoleColumn = columns?.some(col => col.column_name === 'role')
      if (hasRoleColumn) {
        console.log('✅ Role column already exists!')
        return
      }
    }
    
    console.log('\n📋 Manual Steps Required:')
    console.log('\n1. Go to your Supabase Dashboard: https://supabase.com/dashboard')
    console.log('2. Navigate to your project')
    console.log('3. Go to the SQL Editor')
    console.log('4. Run the following SQL commands:')
    console.log('\n--- SQL Commands ---')
    console.log(`-- Add role column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' 
CHECK (role IN ('user', 'admin', 'moderator'));

-- Update any existing admin user (replace with actual admin email)
-- UPDATE public.users 
-- SET role = 'admin' 
-- WHERE email = 'admin@example.com';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Enable RLS policy for role-based access
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Admins can manage all users" ON public.users
  FOR ALL USING (role = 'admin');`)
    console.log('\n--- End SQL Commands ---')
    
    console.log('\n5. After running the SQL, verify the column was added by running:')
    console.log('   SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = \'users\' AND table_schema = \'public\';')
    
    console.log('\n6. Test the application to ensure the 400 errors are resolved')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

addRoleColumn()