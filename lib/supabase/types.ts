export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          email_verified: boolean
          phone_verified: boolean
          subscription_plan: 'free' | 'standard' | 'premium'
          plan_expires_at: string | null
          sms_credits: number
          whatsapp_credits: number
          timezone: string
          currency: string
          role: 'user' | 'admin' | 'moderator'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          phone?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          email_verified?: boolean
          phone_verified?: boolean
          subscription_plan?: 'free' | 'standard' | 'premium'
          plan_expires_at?: string | null
          sms_credits?: number
          whatsapp_credits?: number
          timezone?: string
          currency?: string
          role?: 'user' | 'admin' | 'moderator'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          email_verified?: boolean
          phone_verified?: boolean
          subscription_plan?: 'free' | 'standard' | 'premium'
          plan_expires_at?: string | null
          sms_credits?: number
          whatsapp_credits?: number
          timezone?: string
          currency?: string
          role?: 'user' | 'admin' | 'moderator'
          created_at?: string
          updated_at?: string
        }
      }
      subscription_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          name: string
          description: string | null
          amount: number
          currency: string
          billing_cycle: 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual'
          next_payment_date: string
          last_payment_date: string | null
          status: 'active' | 'paused' | 'cancelled' | 'expired'
          auto_renew: boolean
          website_url: string | null
          logo_url: string | null
          notes: string | null
          reminder_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          name: string
          description?: string | null
          amount: number
          currency?: string
          billing_cycle: 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual'
          next_payment_date: string
          last_payment_date?: string | null
          status?: 'active' | 'paused' | 'cancelled' | 'expired'
          auto_renew?: boolean
          website_url?: string | null
          logo_url?: string | null
          notes?: string | null
          reminder_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          amount?: number
          currency?: string
          billing_cycle?: 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual'
          next_payment_date?: string
          last_payment_date?: string | null
          status?: 'active' | 'paused' | 'cancelled' | 'expired'
          auto_renew?: boolean
          website_url?: string | null
          logo_url?: string | null
          notes?: string | null
          reminder_days?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          subscription_id: string | null
          payment_method_id: string | null
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          transaction_type: 'subscription_payment' | 'refund' | 'adjustment'
          external_transaction_id: string | null
          provider: string | null
          description: string | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id?: string | null
          payment_method_id?: string | null
          amount: number
          currency?: string
          status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          transaction_type: 'subscription_payment' | 'refund' | 'adjustment'
          external_transaction_id?: string | null
          provider?: string | null
          description?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string | null
          payment_method_id?: string | null
          amount?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          transaction_type?: 'subscription_payment' | 'refund' | 'adjustment'
          external_transaction_id?: string | null
          provider?: string | null
          description?: string | null
          processed_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}