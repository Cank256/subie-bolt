'use client';

import { useState, useEffect } from 'react'
import { AdminGuard } from '@/components/ui/admin-guard'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, CreditCard, TrendingUp, Activity, Settings, Shield, BarChart3, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

interface AdminStats {
  total_users: number
  active_users: number
  total_subscriptions: number
  active_subscriptions: number
  total_revenue: number
  monthly_revenue: number
  subscription_categories: Array<{
    name: string
    count: number
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      setLoading(true)
      
      // Try the RPC function first, fallback to manual queries if it fails
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_admin_stats')
      
      if (!rpcError && rpcData) {
        setStats(rpcData)
        return
      }
      
      console.log('RPC function not available, fetching stats manually...')
      
      // Fallback: Fetch stats manually
      const [usersResult, subscriptionsResult, transactionsResult] = await Promise.all([
        supabase.from('users').select('id, created_at', { count: 'exact' }),
        supabase.from('subscriptions').select('id, status', { count: 'exact' }),
        supabase.from('transactions').select('amount, status, created_at', { count: 'exact' })
      ])
      
      // Calculate stats manually
      const totalUsers = usersResult.count || 0
      const activeUsers = usersResult.data?.filter(user => 
        new Date(user.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length || 0
      
      const totalSubscriptions = subscriptionsResult.count || 0
      const activeSubscriptions = subscriptionsResult.data?.filter(sub => sub.status === 'active').length || 0
      
      const completedTransactions = transactionsResult.data?.filter(tx => tx.status === 'completed') || []
      const totalRevenue = completedTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0)
      
      const currentMonth = new Date()
      currentMonth.setDate(1)
      currentMonth.setHours(0, 0, 0, 0)
      const monthlyRevenue = completedTransactions
        .filter(tx => tx.created_at && new Date(tx.created_at) >= currentMonth)
        .reduce((sum, tx) => sum + (tx.amount || 0), 0)
      
      const manualStats: AdminStats = {
        total_users: totalUsers,
        active_users: activeUsers,
        total_subscriptions: totalSubscriptions,
        active_subscriptions: activeSubscriptions,
        total_revenue: totalRevenue,
        monthly_revenue: monthlyRevenue,
        subscription_categories: [] // Will be empty for now
      }
      
      setStats(manualStats)
      
    } catch (err) {
      console.error('Error fetching admin stats:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminGuard requireAdmin={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </AdminGuard>
    )
  }

  if (error) {
    return (
      <AdminGuard requireAdmin={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchAdminStats}>Retry</Button>
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard requireAdmin={true}>
      <AdminLayout>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your Subie platform</p>
              </div>
              <div className="flex space-x-3">
                <Button onClick={fetchAdminStats} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Link href="/subscriptions">
                  <Button variant="outline">View Site</Button>
                </Link>
              </div>
            </div>
          </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.active_users || 0} active this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_subscriptions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.active_subscriptions || 0} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.total_revenue?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground">
                  ${stats?.monthly_revenue?.toFixed(2) || '0.00'} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Operational
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All systems running
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subscription Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Categories</CardTitle>
                    <CardDescription>
                      Distribution of active subscriptions by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats?.subscription_categories?.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.name}</span>
                          <Badge variant="secondary">{category.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/admin/users">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Users
                      </Button>
                    </Link>
                    <Link href="/admin/subscriptions">
                      <Button variant="outline" className="w-full justify-start">
                        <CreditCard className="w-4 h-4 mr-2" />
                        View All Subscriptions
                      </Button>
                    </Link>
                    <Link href="/admin/analytics">
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics Dashboard
                      </Button>
                    </Link>
                    <Link href="/admin/security">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Security Settings
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
                    <p className="text-gray-600 mb-4">Detailed user management interface coming soon</p>
                    <Link href="/admin/users">
                      <Button>Go to User Management</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Management</CardTitle>
                  <CardDescription>
                    Monitor and manage all user subscriptions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Subscription Management</h3>
                    <p className="text-gray-600 mb-4">Detailed subscription management interface coming soon</p>
                    <Link href="/admin/subscriptions">
                      <Button>Go to Subscription Management</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Detailed analytics and reporting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                    <p className="text-gray-600 mb-4">Comprehensive analytics interface coming soon</p>
                    <Link href="/admin/analytics">
                      <Button>Go to Analytics</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}