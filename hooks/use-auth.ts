import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { auth } from '@/lib/supabase/auth'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthUser extends User {
  profile?: UserProfile
}

interface AuthState {
  user: AuthUser | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        await handleAuthChange(session)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await handleAuthChange(session)
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthChange = async (session: Session | null) => {
    if (session?.user) {
      // First, set the user immediately with fallback profile to reduce loading time
      const fallbackProfile: UserProfile | null = session.user.user_metadata ? {
        id: session.user.id,
        email: session.user.email || '',
        phone: session.user.phone || null,
        first_name: session.user.user_metadata.first_name || null,
        last_name: session.user.user_metadata.last_name || null,
        avatar_url: session.user.user_metadata.avatar_url || null,
        email_verified: session.user.email_confirmed_at ? true : false,
        phone_verified: session.user.phone_confirmed_at ? true : false,
        subscription_plan: 'free' as const,
        plan_expires_at: null,
        sms_credits: 0,
        whatsapp_credits: 0,
        timezone: 'UTC',
        currency: 'USD',
        role: (session.user.user_metadata.role as 'user' | 'admin' | 'moderator') || 'user',
        created_at: session.user.created_at,
        updated_at: session.user.updated_at || session.user.created_at
      } : null
      
      const userWithProfile: AuthUser = {
        ...session.user,
        profile: fallbackProfile || undefined
      }
      
      // Set state immediately with fallback data to allow UI to render
      setAuthState({
        user: userWithProfile,
        session,
        profile: fallbackProfile,
        loading: false
      })
      
      // Then fetch the full profile in the background and update if different
      try {
        const profile = await auth.getUserProfile(session.user.id)
        // Only update if the profile data is different from fallback
        if (JSON.stringify(profile) !== JSON.stringify(fallbackProfile)) {
          const updatedUserWithProfile: AuthUser = {
            ...session.user,
            profile
          }
          
          setAuthState(prev => ({
            ...prev,
            user: updatedUserWithProfile,
            profile
          }))
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // Keep the fallback profile if database fetch fails
      }
    } else {
      setAuthState({
        user: null,
        session: null,
        profile: null,
        loading: false
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }))
    try {
      const result = await auth.signIn(email, password)
      return result
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }))
      throw error
    }
  }

  const signUp = async (email: string, password: string, userData: { first_name?: string; last_name?: string }) => {
    setAuthState(prev => ({ ...prev, loading: true }))
    try {
      const result = await auth.signUp(email, password, userData)
      return result
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }))
      throw error
    }
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }))
    try {
      await auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
      setAuthState(prev => ({ ...prev, loading: false }))
      throw error
    }
  }

  const signInWithOAuth = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      return await auth.signInWithOAuth(provider)
    } catch (error) {
      console.error('OAuth sign in error:', error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await auth.resetPassword(email)
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  const updatePassword = async (password: string) => {
    try {
      await auth.updatePassword(password)
    } catch (error) {
      console.error('Password update error:', error)
      throw error
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.user) throw new Error('No authenticated user')
    
    try {
      const updatedProfile = await auth.updateUserProfile(authState.user.id, updates)
      setAuthState(prev => ({
        ...prev,
        profile: updatedProfile,
        user: prev.user ? { ...prev.user, profile: updatedProfile } : null
      }))
      return updatedProfile
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const { user, session, profile, loading } = authState
  const isAdmin = profile?.role === 'admin'
  const isModerator = profile?.role === 'moderator'
  const hasAdminAccess = isAdmin || isModerator

  return {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    resetPassword,
    updatePassword,
    updateProfile,
    isAdmin,
    isModerator,
    hasAdminAccess
  }
}