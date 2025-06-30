require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSPolicies() {
  try {
    console.log('🔧 Fixing RLS policies for users table...');
    
    // First, let's create a policy that allows anon users to read users for authentication
    console.log('📝 Creating RLS policy for user authentication...');
    
    const { data, error } = await supabase.rpc('sql', {
      query: `
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Allow anon read for auth" ON public.users;
        
        -- Create policy to allow anon users to read users for authentication
        CREATE POLICY "Allow anon read for auth" ON public.users
        FOR SELECT
        TO anon
        USING (true);
        
        -- Also allow authenticated users to read users
        DROP POLICY IF EXISTS "Allow authenticated read" ON public.users;
        CREATE POLICY "Allow authenticated read" ON public.users
        FOR SELECT
        TO authenticated
        USING (true);
      `
    });
    
    if (error) {
      console.error('❌ Error creating RLS policies:', error);
      
      // Try alternative approach - disable RLS temporarily for testing
      console.log('🔄 Trying to disable RLS for users table...');
      const { data: disableData, error: disableError } = await supabase.rpc('sql', {
        query: 'ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;'
      });
      
      if (disableError) {
        console.error('❌ Error disabling RLS:', disableError);
        console.log('\n💡 Manual fix needed:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to Authentication > Policies');
        console.log('3. Add a policy for the users table that allows SELECT for anon role');
        console.log('4. Or disable RLS for the users table temporarily');
      } else {
        console.log('✅ RLS disabled for users table');
      }
    } else {
      console.log('✅ RLS policies created successfully');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.log('\n💡 Manual fix needed:');
    console.log('The issue is that Row Level Security (RLS) is blocking anon access to users.');
    console.log('\nOption 1 - Add RLS Policy (Recommended):');
    console.log('1. Go to Supabase Dashboard > Authentication > Policies');
    console.log('2. Create a new policy for the users table');
    console.log('3. Allow SELECT for anon role with condition: true');
    console.log('\nOption 2 - Disable RLS (For development only):');
    console.log('1. Go to Supabase Dashboard > Table Editor');
    console.log('2. Select users table');
    console.log('3. Disable Row Level Security');
  }
}

fixRLSPolicies();