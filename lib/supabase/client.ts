import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// During build/prerender time, use placeholder values to prevent build failures
// At runtime, these will be properly validated
const isStaticGeneration = process.env.NODE_ENV === 'production' && typeof window === 'undefined'
const defaultUrl = 'https://placeholder.supabase.co'
const defaultKey = 'placeholder-key'

// Always use placeholders during static generation if env vars are missing
const finalUrl = isStaticGeneration ? (supabaseUrl || defaultUrl) : (supabaseUrl || '')
const finalKey = isStaticGeneration ? (supabaseAnonKey || defaultKey) : (supabaseAnonKey || '')

// Only validate environment variables in development AND when not in static generation
const shouldValidate = process.env.NODE_ENV === 'development' && !isStaticGeneration

if (shouldValidate && !supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (shouldValidate && !supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Check for placeholder values (only warn at runtime, not during static generation)
if (!isStaticGeneration && finalUrl.includes('placeholder') || finalUrl.includes('your_supabase')) {
  console.warn('⚠️  Supabase URL appears to be a placeholder. Please update NEXT_PUBLIC_SUPABASE_URL in your .env file with your actual Supabase project URL.')
}

if (!isStaticGeneration && finalKey.includes('placeholder') || finalKey.includes('your_supabase')) {
  console.warn('⚠️  Supabase anon key appears to be a placeholder. Please update NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file with your actual Supabase anon key.')
}

// Validate URL format only if it's not a placeholder and not during static generation
let cleanUrl = finalUrl
if (!isStaticGeneration && !finalUrl.includes('placeholder')) {
  try {
    new URL(finalUrl)
    // Ensure URL doesn't have trailing slash
    cleanUrl = finalUrl.replace(/\/$/, '')
  } catch (error) {
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL: ${finalUrl}`)
  }
}

// Singleton pattern to prevent multiple client instances
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(cleanUrl, finalKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  }
  return supabaseInstance
}

// Export the singleton instance
export const supabase = getSupabaseClient()

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