import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Check for placeholder values
if (supabaseUrl.includes('placeholder') || supabaseUrl.includes('your_supabase')) {
  console.warn('⚠️  Supabase URL appears to be a placeholder. Please update NEXT_PUBLIC_SUPABASE_URL in your .env file with your actual Supabase project URL.')
}

if (supabaseAnonKey.includes('placeholder') || supabaseAnonKey.includes('your_supabase')) {
  console.warn('⚠️  Supabase anon key appears to be a placeholder. Please update NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file with your actual Supabase anon key.')
}

// Validate URL format only if it's not a placeholder
let cleanUrl = supabaseUrl
if (!supabaseUrl.includes('placeholder')) {
  try {
    new URL(supabaseUrl)
    // Ensure URL doesn't have trailing slash
    cleanUrl = supabaseUrl.replace(/\/$/, '')
  } catch (error) {
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`)
  }
}

export const supabase = createClient<Database>(cleanUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})