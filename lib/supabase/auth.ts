import { supabase } from './client'
import { Database } from './types'

type User = Database['public']['Tables']['users']['Row']
type AuthUser = {
  id: string
  email: string
  user_metadata?: {
    first_name?: string
    last_name?: string
  }
  avatar_url?: string
  role: 'user' | 'admin' | 'moderator'
}

type AuthSession = {
  user: AuthUser
  access_token: string
  refresh_token: string
}

export const auth = {
  async signUp(email: string, password: string, userData: { first_name?: string; last_name?: string }) {
    try {
      // Create user in Supabase Auth with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
          }
        }
      })
      
      if (error) throw error
      if (!data.user) throw new Error('Failed to create user')
      
      // The user record will be created automatically via database trigger
      // or we can create it here if needed
      if (data.user.email_confirmed_at) {
        await this.createUserProfile(data.user.id, {
          email: data.user.email!,
          first_name: userData.first_name,
          last_name: userData.last_name,
        })
      }
      
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  },

  async signIn(email: string, password: string) {
    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      if (!data.user || !data.session) throw new Error('Failed to sign in')
      
      // Get user profile with role
      const userProfile = await this.getUserProfile(data.user.id)
      
      return {
        user: data.user,
        session: data.session,
        profile: userProfile
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  async signInWithOAuth(provider: 'google' | 'apple' | 'facebook') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    if (error) throw error
  },

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  },

  async createUserProfile(userId: string, profileData: {
    email: string
    first_name?: string
    last_name?: string
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: profileData.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        role: 'user'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUserProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}