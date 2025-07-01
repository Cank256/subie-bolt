'use client';

import { useState, useEffect } from 'react'
import { AdminGuard } from '@/components/ui/admin-guard'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { 
  BarChart3,
  TrendingUp, 
  Users, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Download,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

interface AnalyticsData {
  totalUsers: number
  totalSubscriptions: number
  totalRevenue: number
  activeSubscriptions: number
  userGrowth: Array<{ month: string; users: number }>
  revenueGrowth: Array<{ month: string; revenue: number }>
  subscriptionsByCategory: Array<{ category: string; count: number; revenue: number }>
  subscriptionsByStatus: Array<{ status: string; count: number }>
  usersByPlan: Array<{ plan: string; count: number }>
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Fetch basic stats
      const { data: adminStats } = await supabase.rpc('get_admin_stats')
      
      // Fetch users data
      const { data: users } = await supabase
        .from('users')
        .select('created_at, subscription_plan')
        .order('created_at', { ascending: true })
      
      // Fetch subscriptions data
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select(`
          *,
          subscription_categories(name)
        `)
      
      if (users && subscriptions) {
        const processedAnalytics = processAnalyticsData(adminStats, users, subscriptions)
        setAnalytics(processedAnalytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const processAnalyticsData = (adminStats: any, users: any[], subscriptions: any[]): AnalyticsData => {
    // Process user growth data
    const userGrowth = processUserGrowth(users)
    
    // Process revenue growth data
    const revenueGrowth = processRevenueGrowth(subscriptions)
    
    // Process subscriptions by category
    const subscriptionsByCategory = processSubscriptionsByCategory(subscriptions)
    
    // Process subscriptions by status
    const subscriptionsByStatus = processSubscriptionsByStatus(subscriptions)
    
    // Process users by plan
    const usersByPlan = processUsersByPlan(users)
    
    return {
      totalUsers: adminStats?.total_users || 0,
      totalSubscriptions: adminStats?.total_subscriptions || 0,
      totalRevenue: adminStats?.total_revenue || 0,
      activeSubscriptions: subscriptions.filter(sub => sub.status === 'active').length,
      userGrowth,
      revenueGrowth,
      subscriptionsByCategory,
      subscriptionsByStatus,
      usersByPlan
    }
  }

  const processUserGrowth = (users: any[]) => {
    const monthlyData: { [key: string]: number } = {}
    
    users.forEach(user => {
      const month = new Date(user.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      })
      monthlyData[month] = (monthlyData[month] || 0) + 1
    })
    
    return Object.entries(monthlyData)
      .map(([month, users]) => ({ month, users }))
      .slice(-6) // Last 6 months
  }

  const processRevenueGrowth = (subscriptions: any[]) => {
    const monthlyRevenue: { [key: string]: number } = {}
    
    subscriptions
      .filter(sub => sub.status === 'active')
      .forEach(sub => {
        const month = new Date(sub.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        })
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (sub.amount || 0)
      })
    
    return Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({ month, revenue }))
      .slice(-6) // Last 6 months
  }

  const processSubscriptionsByCategory = (subscriptions: any[]) => {
    const categoryData: { [key: string]: { count: number; revenue: number } } = {}
    
    subscriptions.forEach(sub => {
      const category = sub.subscription_categories?.name || 'Unknown'
      if (!categoryData[category]) {
        categoryData[category] = { count: 0, revenue: 0 }
      }
      categoryData[category].count += 1
      if (sub.status === 'active') {
        categoryData[category].revenue += sub.amount || 0
      }
    })
    
    return Object.entries(categoryData)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.count - a.count)
  }

  const processSubscriptionsByStatus = (subscriptions: any[]) => {
    const statusData: { [key: string]: number } = {}
    
    subscriptions.forEach(sub => {
      statusData[sub.status] = (statusData[sub.status] || 0) + 1
    })
    
    return Object.entries(statusData)
      .map(([status, count]) => ({ status, count }))
  }

  const processUsersByPlan = (users: any[]) => {
    const planData: { [key: string]: number } = {}
    
    users.forEach(user => {
      const plan = user.subscription_plan || 'free'
      planData[plan] = (planData[plan] || 0) + 1
    })
    
    return Object.entries(planData)
      .map(([plan, count]) => ({ plan, count }))
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
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

  if (!analytics) {
    return (
      <AdminGuard requireAdmin={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load analytics</h2>
            <Button onClick={fetchAnalytics}>Try Again</Button>
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
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="w-8 h-8 mr-3 text-purple-600" />
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Comprehensive analytics and insights</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
                    <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.activeSubscriptions}</p>
                    <p className="text-sm text-green-600 mt-1">+8% from last month</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
                    <p className="text-sm text-green-600 mt-1">+15% from last month</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">24.5%</p>
                    <p className="text-sm text-green-600 mt-1">+2.1% from last month</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>Monthly recurring revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.revenueGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subscriptions by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions by Category</CardTitle>
                <CardDescription>Distribution of subscription categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analytics.subscriptionsByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ category, count }) => `${category}: ${count}`}
                    >
                      {analytics.subscriptionsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
                <CardDescription>Current subscription statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.subscriptionsByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Users by Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Users by Plan</CardTitle>
                <CardDescription>Distribution of subscription plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.usersByPlan.map((plan, index) => (
                    <div key={plan.plan} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium capitalize">{plan.plan}</span>
                      </div>
                      <Badge variant="outline">{plan.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}