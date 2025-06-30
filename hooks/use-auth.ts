import { useEffect, useState } from 'react'

interface CustomUser {
  id: string
  email: string
  user_metadata?: {
    first_name?: string
    last_name?: string
  }
  avatar_url?: string
  role: 'user' | 'admin' | 'moderator'
}

interface CustomSession {
  user: CustomUser
  access_token: string
  refresh_token: string
}

export function useAuth() {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [session, setSession] = useState<CustomSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client side to avoid SSR issues
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    // Check for existing session in localStorage
    const storedSession = localStorage.getItem('subie_session')
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession)
        setSession(parsedSession)
        setUser(parsedSession.user)
      } catch (error) {
        console.error('Error parsing stored session:', error)
        localStorage.removeItem('subie_session')
      }
    }
    setLoading(false)
  }, [])

  const signIn = (sessionData: CustomSession) => {
    setSession(sessionData)
    setUser(sessionData.user)
    if (typeof window !== 'undefined') {
      localStorage.setItem('subie_session', JSON.stringify(sessionData))
    }
  }

  const signOut = () => {
    setSession(null)
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('subie_session')
    }
  }

  const isAdmin = user?.role === 'admin'
  const isModerator = user?.role === 'moderator'
  const hasAdminAccess = isAdmin || isModerator

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    isAdmin,
    isModerator,
    hasAdminAccess
  }
}