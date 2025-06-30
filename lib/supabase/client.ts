import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// During build time, use placeholder values to prevent build failures
// At runtime, these will be properly validated
const isBuildTime = typeof window === 'undefined' && (!supabaseUrl || !supabaseAnonKey)
const defaultUrl = 'https://placeholder.supabase.co'
const defaultKey = 'placeholder-key'

const finalUrl = supabaseUrl || (isBuildTime ? defaultUrl : '')
const finalKey = supabaseAnonKey || (isBuildTime ? defaultKey : '')

// Only throw errors if we're not in build time and values are missing
if (!isBuildTime && !finalUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!isBuildTime && !finalKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Check for placeholder values (only warn at runtime, not during build)
if (!isBuildTime && finalUrl.includes('placeholder') || finalUrl.includes('your_supabase')) {
  console.warn('⚠️  Supabase URL appears to be a placeholder. Please update NEXT_PUBLIC_SUPABASE_URL in your .env file with your actual Supabase project URL.')
}

if (!isBuildTime && finalKey.includes('placeholder') || finalKey.includes('your_supabase')) {
  console.warn('⚠️  Supabase anon key appears to be a placeholder. Please update NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file with your actual Supabase anon key.')
}

// Validate URL format only if it's not a placeholder and not build time
let cleanUrl = finalUrl
if (!isBuildTime && !finalUrl.includes('placeholder')) {
  try {
    new URL(finalUrl)
    // Ensure URL doesn't have trailing slash
    cleanUrl = finalUrl.replace(/\/$/, '')
  } catch (error) {
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL: ${finalUrl}`)
  }
}

export const supabase = createClient<Database>(cleanUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Runtime validation function for client-side usage
export const validateSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url || url.includes('placeholder')) {
      throw new Error('Supabase URL is not configured. Please set NEXT_PUBLIC_SUPABASE_URL in your environment variables.')
    }
    
    if (!key || key.includes('placeholder')) {
      throw new Error('Supabase anon key is not configured. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.')
    }
  }
}