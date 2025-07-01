'use client';

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    if (!loading && !user) {
      setRedirecting(true)
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  // Show a more lightweight loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    )
  }

  // Don't render anything while redirecting
  if (!user || redirecting) {
    return null
  }

  // Render children immediately when user is available
  return <>{children}</>
}