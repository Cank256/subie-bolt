import { useEffect, useState } from 'react'
import { subscriptions } from '@/lib/supabase/subscriptions'
import { Database } from '@/lib/supabase/types'

type Subscription = Database['public']['Tables']['subscriptions']['Row'] & {
  subscription_categories?: Database['public']['Tables']['subscription_categories']['Row']
}

export function useSubscriptions() {
  const [data, setData] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await subscriptions.getAll()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const addSubscription = async (subscription: Parameters<typeof subscriptions.create>[0]) => {
    try {
      await subscriptions.create(subscription)
      await fetchSubscriptions() // Refresh the list
    } catch (err) {
      throw err
    }
  }

  const updateSubscription = async (id: string, updates: Parameters<typeof subscriptions.update>[1]) => {
    try {
      await subscriptions.update(id, updates)
      await fetchSubscriptions() // Refresh the list
    } catch (err) {
      throw err
    }
  }

  const deleteSubscription = async (id: string) => {
    try {
      await subscriptions.delete(id)
      await fetchSubscriptions() // Refresh the list
    } catch (err) {
      throw err
    }
  }

  return {
    subscriptions: data,
    loading,
    error,
    refetch: fetchSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  }
}