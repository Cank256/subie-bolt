import { supabase } from './client'
import { Database } from './types'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

type User = Database['public']['Tables']['users']['Row']

// Create a separate client with service role key for authentication
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseAuth = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string, userData?: {
    firstName?: string
    lastName?: string
    phone?: string
  }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData?.firstName,
          last_name: userData?.lastName,
          phone: userData?.phone,
        }
      }
    })

    if (authError) throw authError

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          first_name: userData?.firstName || null,
          last_name: userData?.lastName || null,
          phone: userData?.phone || null,
        })

      if (profileError) throw profileError
    }

    return authData
  },

  // Sign in with email and password (custom implementation)
  async signIn(email: string, password: string) {
    // First, find the user in our users table using service role key
    const { data: users, error: userError } = await supabaseAuth
      .from('users')
      .select('id, email, password_hash, first_name, last_name, role')
      .eq('email', email)
      .limit(1)

    if (userError || !users || users.length === 0) {
      throw new Error('Invalid login credentials')
    }

    const user = users[0]

    // Check if user has a password hash
    if (!user.password_hash) {
      throw new Error('Invalid login credentials')
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      throw new Error('Invalid login credentials')
    }

    // Create a session token (simplified - in production you'd want JWT)
    const sessionData = {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role || 'user'
      },
      access_token: 'custom_token_' + user.id,
      refresh_token: 'refresh_' + user.id
    }

    return { user: sessionData.user, session: sessionData }
  },

  // Sign in with OAuth providers
  async signInWithProvider(provider: 'google' | 'facebook' | 'apple') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get current session
  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) throw error
  },

  // Update password
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}