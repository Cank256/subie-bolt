import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types (you can generate these with `supabase gen types typescript`)
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
          created_at?: string
          updated_at?: string
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
    }
  }
}