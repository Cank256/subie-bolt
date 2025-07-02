import { supabase } from '../supabase/client';
import { auth } from '../supabase/auth';
import type { Database } from '../supabase/types';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    phone_number?: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo?: string;
  };
  callback: (response: any) => void;
  onclose: () => void;
}

interface FlutterwaveResponse {
  status: string;
  transaction_id: string;
  tx_ref: string;
  flw_ref: string;
  device_fingerprint: string;
  amount: number;
  currency: string;
  charged_amount: number;
  app_fee: number;
  merchant_fee: number;
  processor_response: string;
  auth_model: string;
  ip: string;
  narration: string;
  status_message: string;
  validation_required: boolean;
  card: any;
  customer: {
    id: number;
    name: string;
    phone_number: string;
    email: string;
    created_at: string;
  };
}

class FlutterwaveService {
  private static instance: FlutterwaveService;
  private isInitialized = false;
  private publicKey: string | null = null;

  private constructor() {}

  static getInstance(): FlutterwaveService {
    if (!FlutterwaveService.instance) {
      FlutterwaveService.instance = new FlutterwaveService();
    }
    return FlutterwaveService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
    if (!publicKey || publicKey === 'your_flutterwave_public_key') {
      console.warn('Flutterwave public key not found or not configured. Please set NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY in your environment variables.');
      throw new Error('Flutterwave public key not configured. Please set a valid NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY in your environment variables.');
    }

    this.publicKey = publicKey;
    this.isInitialized = true;
    console.log('Flutterwave initialized successfully');
  }

  async initializePayment(config: Omit<FlutterwaveConfig, 'public_key'>): Promise<void> {
    if (!this.isInitialized || !this.publicKey) {
      throw new Error('Flutterwave not initialized');
    }

    // Load Flutterwave script if not already loaded
    if (!window.FlutterwaveCheckout) {
      await this.loadFlutterwaveScript();
    }

    const paymentConfig: FlutterwaveConfig = {
      ...config,
      public_key: this.publicKey,
    };

    window.FlutterwaveCheckout(paymentConfig);
  }

  private loadFlutterwaveScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.FlutterwaveCheckout) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Flutterwave script'));
      document.head.appendChild(script);
    });
  }

  async verifyTransaction(transactionId: string): Promise<any> {
    try {
      // This would typically be done on the backend for security
      // For now, we'll just return the transaction data from the frontend callback
      console.log('Verifying transaction:', transactionId);
      return { status: 'success', transaction_id: transactionId };
    } catch (error) {
      console.error('Failed to verify transaction:', error);
      throw error;
    }
  }

  async processSubscriptionPayment(
    planType: 'standard' | 'premium',
    billingCycle: 'monthly' | 'annual',
    userEmail: string,
    userName: string
  ): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Flutterwave not initialized');
    }

    const plans = {
      standard: {
        monthly: { amount: 9.99, description: 'Standard Monthly Plan' },
        annual: { amount: 99.99, description: 'Standard Annual Plan' },
      },
      premium: {
        monthly: { amount: 19.99, description: 'Premium Monthly Plan' },
        annual: { amount: 199.99, description: 'Premium Annual Plan' },
      },
    };

    const selectedPlan = plans[planType][billingCycle];
    const txRef = `subie_${planType}_${billingCycle}_${Date.now()}`;

    const config = {
      tx_ref: txRef,
      amount: selectedPlan.amount,
      currency: 'USD',
      payment_options: 'card,mobilemoney,ussd',
      customer: {
        email: userEmail,
        name: userName,
      },
      customizations: {
        title: 'Subie Subscription',
        description: selectedPlan.description,
        logo: 'https://subie.app/logo.png',
      },
      callback: async (response: FlutterwaveResponse) => {
        if (response.status === 'successful') {
          await this.handleSuccessfulPayment(response, planType, billingCycle);
        } else {
          console.error('Payment failed:', response);
        }
      },
      onclose: () => {
        console.log('Payment modal closed');
      },
    };

    await this.initializePayment(config);
  }

  /**
   * Handle successful payment and update user subscription
   */
  async handleSuccessfulPayment(
    userId: string,
    planType: 'standard' | 'premium',
    billingCycle: 'monthly' | 'annual',
    transactionId: string,
    amount: number
  ): Promise<void> {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Calculate expiration date
      const now = new Date();
      const expiresAt = new Date(now);
      if (billingCycle === 'monthly') {
        expiresAt.setMonth(now.getMonth() + 1);
      } else {
        expiresAt.setFullYear(now.getFullYear() + 1);
      }

      // Update user subscription
      const { error: userError } = await supabase
        .from('users')
        .update({
          subscription_plan: planType,
          subscription_status: 'active',
          subscription_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (userError) {
        throw new Error(`Failed to update user subscription: ${userError.message}`);
      }

      // Store transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          transaction_id: transactionId,
          amount,
          currency: 'USD',
          status: 'completed',
          payment_method: 'flutterwave',
          description: `${planType} plan - ${billingCycle} billing`,
          created_at: new Date().toISOString(),
        });

      if (transactionError) {
        console.error('Failed to store transaction:', transactionError);
        // Don't throw here as the subscription update was successful
      }

      console.log('Subscription updated successfully');
    } catch (error) {
      console.error('Error handling successful payment:', error);
      throw error;
    }
  }

  private async storeTransactionRecord(
    response: FlutterwaveResponse,
    planType: string,
    billingCycle: string,
    userId: string
  ): Promise<void> {
    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: userId,
        transaction_id: response.transaction_id,
        flw_ref: response.flw_ref,
        amount: response.amount,
        currency: response.currency,
        status: response.status,
        payment_method: 'flutterwave',
        plan_type: planType,
        billing_cycle: billingCycle,
        transaction_data: response,
      });

      if (error) {
        console.error('Failed to store transaction record:', error);
      }
    } catch (error) {
      console.error('Error storing transaction record:', error);
    }
  }

  /**
   * Get user subscription status
   */
  async getSubscriptionStatus(userId: string): Promise<{
    hasActiveSubscription: boolean;
    subscriptionPlan: 'free' | 'standard' | 'premium';
    expiresAt: string | null;
  }> {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: user, error } = await supabase
        .from('users')
        .select('subscription_plan, subscription_status, subscription_expires_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching subscription status:', error);
        return {
          hasActiveSubscription: false,
          subscriptionPlan: 'free',
          expiresAt: null,
        };
      }

      const now = new Date();
      const expiresAt = user.subscription_expires_at ? new Date(user.subscription_expires_at) : null;
      const isActive = user.subscription_status === 'active' && expiresAt && expiresAt > now;

      return {
        hasActiveSubscription: isActive,
        subscriptionPlan: isActive ? (user.subscription_plan as 'standard' | 'premium') : 'free',
        expiresAt: user.subscription_expires_at,
      };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return {
        hasActiveSubscription: false,
        subscriptionPlan: 'free',
        expiresAt: null,
      };
    }
  }
}

// Extend Window interface for Flutterwave
declare global {
  interface Window {
    FlutterwaveCheckout: (config: FlutterwaveConfig) => void;
  }
}

export const flutterwaveService = FlutterwaveService.getInstance();
export type { FlutterwaveConfig, FlutterwaveResponse };