import { supabase } from './client'
import { Database } from './types'

type Transaction = Database['public']['Tables']['transactions']['Row']
type TransactionInsert = Database['public']['Tables']['transactions']['Insert']

export const transactions = {
  // Get all transactions for current user
  async getAll(limit: number = 50) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        subscriptions (
          name,
          subscription_categories (
            name,
            icon,
            color
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  // Get transactions by subscription
  async getBySubscription(subscriptionId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Create new transaction
  async create(transaction: Omit<TransactionInsert, 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get spending summary
  async getSpendingSummary(startDate?: string, endDate?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('transactions')
      .select('amount, status, created_at')
      .eq('user_id', user.id)
      .eq('transaction_type', 'subscription_payment')

    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data, error } = await query

    if (error) throw error

    const summary = data.reduce((acc, transaction) => {
      if (transaction.status === 'completed') {
        acc.totalSpent += transaction.amount
        acc.successfulPayments += 1
      } else if (transaction.status === 'failed') {
        acc.failedPayments += 1
      }
      acc.totalTransactions += 1
      return acc
    }, {
      totalSpent: 0,
      successfulPayments: 0,
      failedPayments: 0,
      totalTransactions: 0
    })

    return summary
  }
}