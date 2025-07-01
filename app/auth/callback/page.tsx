'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { auth } from '@/lib/supabase/auth'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setError('Authentication failed. Please try again.')
          setTimeout(() => router.push('/login'), 3000)
          return
        }

        if (data.session?.user) {
          try {
            // Get user profile to determine redirect
            const profile = await auth.getUserProfile(data.session.user.id)
            
            if (profile?.role === 'admin' || profile?.role === 'moderator') {
              router.push('/admin')
            } else {
              router.push('/subscriptions')
            }
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError)
            // Default to subscriptions if profile fetch fails
            router.push('/subscriptions')
          }
        } else {
          router.push('/login')
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        setError('An unexpected error occurred. Please try again.')
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="text-center max-w-md mx-auto px-4">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing Authentication</h2>
            <p className="text-gray-600">Please wait while we sign you in...</p>
          </>
        )}
      </div>
    </div>
  )
}