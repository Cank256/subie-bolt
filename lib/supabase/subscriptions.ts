import { supabase } from './client'
import { Database } from './types'

type Subscription = Database['public']['Tables']['subscriptions']['Row']
type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']
type Category = Database['public']['Tables']['subscription_categories']['Row']

export const subscriptions = {
  // Get all subscriptions for current user
  async getAll() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_categories (
          id,
          name,
          icon,
          color
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get subscription by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_categories (
          id,
          name,
          icon,
          color
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new subscription
  async create(subscription: Omit<SubscriptionInsert, 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        ...subscription,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update subscription
  async update(id: string, updates: SubscriptionUpdate) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete subscription
  async delete(id: string) {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get upcoming payments
  async getUpcomingPayments(days: number = 30) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_categories (
          id,
          name,
          icon,
          color
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .lte('next_payment_date', futureDate.toISOString().split('T')[0])
      .order('next_payment_date', { ascending: true })

    if (error) throw error
    return data
  },

  // Get spending analytics
  async getSpendingAnalytics() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        amount,
        billing_cycle,
        status,
        subscription_categories (
          name,
          color
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (error) throw error

    // Calculate monthly spending
    const monthlySpending = data.reduce((total, sub) => {
      let monthlyAmount = sub.amount
      
      switch (sub.billing_cycle) {
        case 'weekly':
          monthlyAmount = sub.amount * 4.33
          break
        case 'quarterly':
          monthlyAmount = sub.amount / 3
          break
        case 'semi_annual':
          monthlyAmount = sub.amount / 6
          break
        case 'annual':
          monthlyAmount = sub.amount / 12
          break
      }
      
      return total + monthlyAmount
    }, 0)

    // Group by category
    const categorySpending = data.reduce((acc, sub) => {
      const categoryName = sub.subscription_categories?.name || 'Other'
      const categoryColor = sub.subscription_categories?.color || '#6B7280'
      
      let monthlyAmount = sub.amount
      switch (sub.billing_cycle) {
        case 'weekly':
          monthlyAmount = sub.amount * 4.33
          break
        case 'quarterly':
          monthlyAmount = sub.amount / 3
          break
        case 'semi_annual':
          monthlyAmount = sub.amount / 6
          break
        case 'annual':
          monthlyAmount = sub.amount / 12
          break
      }

      if (!acc[categoryName]) {
        acc[categoryName] = {
          amount: 0,
          color: categoryColor,
          count: 0
        }
      }
      
      acc[categoryName].amount += monthlyAmount
      acc[categoryName].count += 1
      
      return acc
    }, {} as Record<string, { amount: number; color: string; count: number }>)

    return {
      totalMonthly: monthlySpending,
      activeCount: data.length,
      categoryBreakdown: Object.entries(categorySpending).map(([name, data]) => ({
        category: name,
        amount: data.amount,
        color: data.color,
        count: data.count,
        percentage: Math.round((data.amount / monthlySpending) * 100)
      }))
    }
  }
}

export const categories = {
  // Get all categories
  async getAll() {
    const { data, error } = await supabase
      .from('subscription_categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  }
}