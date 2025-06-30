'use client';

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AdminGuardProps {
  children: React.ReactNode
  redirectTo?: string
  requireAdmin?: boolean // if false, allows moderators too
}

export function AdminGuard({ 
  children, 
  redirectTo = '/subscriptions',
  requireAdmin = false 
}: AdminGuardProps) {
  const { user, loading, isAdmin, hasAdminAccess } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }
      
      const hasAccess = requireAdmin ? isAdmin : hasAdminAccess
      if (!hasAccess) {
        router.push(redirectTo)
        return
      }
    }
  }, [user, loading, isAdmin, hasAdminAccess, router, redirectTo, requireAdmin])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const hasAccess = requireAdmin ? isAdmin : hasAdminAccess
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don&apos;t have permission to access this area.</p>
          <button 
            onClick={() => router.push(redirectTo)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}