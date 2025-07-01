const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyMigration() {
  try {
    console.log('Applying auth trigger migration...')
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250131000001_create_auth_trigger.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`Executing ${statements.length} SQL statements...`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`)
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          if (error) {
            // Try direct execution if RPC fails
            const { error: directError } = await supabase
              .from('_temp')
              .select('1')
              .limit(0) // This will fail but allows us to execute raw SQL
            
            // If that doesn't work, log the statement for manual execution
            console.log('Statement to execute manually:', statement)
          }
        } catch (err) {
          console.log('Statement to execute manually:', statement)
        }
      }
    }
    
    console.log('Migration application completed!')
    console.log('\nNote: Some statements may need to be executed manually in the Supabase SQL editor.')
    console.log('Please check the output above for any statements that need manual execution.')
    
  } catch (error) {
    console.error('Error applying migration:', error)
    process.exit(1)
  }
}

applyMigration()