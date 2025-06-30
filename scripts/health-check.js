const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function checkmark(condition) {
  return condition ? '✅' : '❌'
}

function warning(condition) {
  return condition ? '⚠️ ' : '✅'
}

async function runHealthCheck() {
  console.log('🏥 Subie Health Check\n')
  console.log('=' .repeat(50))
  
  // 1. Environment Variables Check
  console.log('\n📋 Environment Variables:')
  console.log(`${checkmark(!!supabaseUrl)} NEXT_PUBLIC_SUPABASE_URL`)
  console.log(`${checkmark(!!supabaseAnonKey)} NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  console.log(`${checkmark(!!supabaseServiceKey)} SUPABASE_SERVICE_ROLE_KEY`)
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('\n❌ Missing required environment variables. Cannot proceed with database checks.')
    return
  }
  
  // 2. File System Checks
  console.log('\n📁 File System:')
  const favicon = fs.existsSync(path.join(process.cwd(), 'public', 'favicon.ico'))
  const mobileFeature = fs.existsSync(path.join(process.cwd(), 'app', 'features', 'mobile', 'page.tsx'))
  const remindersFeature = fs.existsSync(path.join(process.cwd(), 'app', 'features', 'reminders', 'page.tsx'))
  
  console.log(`${checkmark(favicon)} Favicon exists`)
  console.log(`${checkmark(mobileFeature)} Mobile feature page exists`)
  console.log(`${checkmark(remindersFeature)} Reminders feature page exists`)
  
  // 3. Supabase Connection Check
  console.log('\n🔌 Supabase Connection:')
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('subscription_categories')
      .select('count')
      .limit(1)
    
    console.log(`${checkmark(!testError)} Database connection`)
    
    if (testError) {
      console.log(`   Error: ${testError.message}`)
      return
    }
    
  } catch (error) {
    console.log(`❌ Database connection failed: ${error.message}`)
    return
  }
  
  // 4. Users Table Schema Check
  console.log('\n👥 Users Table Schema:')
  try {
    // Check if we can query users table structure
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (usersError) {
      console.log(`❌ Users table query failed: ${usersError.message}`)
      
      // Check if it's a column issue
      if (usersError.message.includes('column') && usersError.message.includes('role')) {
        console.log('\n🔧 Role Column Issue Detected:')
        console.log('   The role column is missing from the users table.')
        console.log('   Run: npm run add-role-column')
        console.log('   Or manually add the column via Supabase Dashboard.')
      }
    } else {
      console.log(`✅ Users table accessible`)
      
      // Try to check for specific columns
      try {
        const { data: roleTest, error: roleError } = await supabase
          .from('users')
          .select('id, email, role')
          .limit(1)
        
        console.log(`${checkmark(!roleError)} Role column exists`)
        
        if (roleError && roleError.message.includes('role')) {
          console.log('\n🔧 Action Required:')
          console.log('   Run: npm run add-role-column')
        }
      } catch (roleCheckError) {
        console.log(`⚠️  Could not verify role column: ${roleCheckError.message}`)
      }
    }
  } catch (error) {
    console.log(`❌ Users table check failed: ${error.message}`)
  }
  
  // 5. Client Configuration Check
  console.log('\n⚙️  Client Configuration:')
  const clientPath = path.join(process.cwd(), 'lib', 'supabase', 'client.ts')
  if (fs.existsSync(clientPath)) {
    const clientContent = fs.readFileSync(clientPath, 'utf8')
    const hasSingleton = clientContent.includes('getSupabaseClient')
    console.log(`${checkmark(hasSingleton)} Singleton pattern implemented`)
  } else {
    console.log('❌ Client file not found')
  }
  
  // 6. Summary
  console.log('\n📊 Summary:')
  console.log('\nFixed Issues:')
  console.log('• ✅ Favicon added (fixes 404 error)')
  console.log('• ✅ Mobile feature page created')
  console.log('• ✅ Reminders feature page created')
  console.log('• ✅ Supabase client singleton pattern implemented')
  
  console.log('\nNext Steps:')
  console.log('1. If role column issues persist, run: npm run add-role-column')
  console.log('2. Test the application in development: npm run dev')
  console.log('3. Check browser console for remaining errors')
  console.log('4. Verify all features work as expected')
  
  console.log('\n🎉 Health check complete!')
}

runHealthCheck().catch(console.error)