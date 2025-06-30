require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  try {
    // Query the information schema to get column details
    const { data, error } = await supabase
      .rpc('exec', {
        sql: `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = 'users' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });

    if (error) {
      console.error('Error querying table structure:', error);
      return;
    }

    console.log('Users table structure:');
    console.log(data);

    // Also check if password_hash column exists specifically
    const { data: passwordCheck, error: passwordError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name = 'password_hash'
            AND table_schema = 'public'
          ) as password_hash_exists;
        `
      });

    if (passwordError) {
      console.error('Error checking password_hash column:', passwordError);
    } else {
      console.log('Password hash column exists:', passwordCheck);
    }

  } catch (error) {
    console.error('Script error:', error);
  }
}

checkTableStructure();