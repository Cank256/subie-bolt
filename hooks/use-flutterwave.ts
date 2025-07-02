import { useState, useEffect } from 'react';
import { flutterwaveService } from '@/lib/flutterwave/client';
import { useAuth } from './use-auth';
import { toast } from './use-toast';

interface UseFlutterwaveReturn {
  // State
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Subscription info
  hasActiveSubscription: boolean;
  subscriptionPlan: 'free' | 'standard' | 'premium';
  expiresAt: string | null;
  
  // Actions
  processPayment: (planType: 'standard' | 'premium', billingCycle: 'monthly' | 'annual') => Promise<void>;
  refreshSubscriptionStatus: () => Promise<void>;
  
  // Plan pricing
  getPlanPrice: (planType: 'standard' | 'premium', billingCycle: 'monthly' | 'annual') => number;
  getPlanFeatures: (planType: 'free' | 'standard' | 'premium') => string[];
}

export function useFlutterwave(): UseFlutterwaveReturn {
  const { user } = useAuth();
  
  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'standard' | 'premium'>('free');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  // Initialize Flutterwave
  useEffect(() => {
    const initializeFlutterwave = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await flutterwaveService.initialize();
        setIsInitialized(true);
        
        // Fetch subscription status if user is logged in
        if (user?.id) {
          await fetchSubscriptionStatus();
        }
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Flutterwave';
        setError(errorMessage);
        console.error('Flutterwave initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFlutterwave();
  }, [user?.id]);

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    if (!user?.id) return;
    
    try {
      const status = await flutterwaveService.getSubscriptionStatus(user.id);
      setHasActiveSubscription(status.hasActiveSubscription);
      setSubscriptionPlan(status.subscriptionPlan);
      setExpiresAt(status.expiresAt);
    } catch (err) {
      console.error('Failed to fetch subscription status:', err);
    }
  };

  // Process payment
  const processPayment = async (planType: 'standard' | 'premium', billingCycle: 'monthly' | 'annual'): Promise<void> => {
    if (!isInitialized) {
      throw new Error('Flutterwave not initialized');
    }

    if (!user?.email) {
      throw new Error('User not logged in');
    }

    try {
      setIsLoading(true);
      
      const userName = user.user_metadata?.full_name || user.email.split('@')[0];
      
      await flutterwaveService.processSubscriptionPayment(
        planType,
        billingCycle,
        user.email,
        userName
      );
      
      // Refresh subscription status after payment
      await fetchSubscriptionStatus();
      
      toast({
        title: 'Payment Initiated',
        description: 'Please complete the payment process in the popup window.',
      });
      
    } catch (err) {
      console.error('Payment failed:', err);
      
      toast({
        title: 'Payment Failed',
        description: err instanceof Error ? err.message : 'An error occurred during payment.',
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh subscription status
  const refreshSubscriptionStatus = async () => {
    try {
      await fetchSubscriptionStatus();
    } catch (err) {
      console.error('Failed to refresh subscription status:', err);
    }
  };

  // Get plan price
  const getPlanPrice = (planType: 'standard' | 'premium', billingCycle: 'monthly' | 'annual'): number => {
    const plans = {
      standard: {
        monthly: 9.99,
        annual: 99.99,
      },
      premium: {
        monthly: 19.99,
        annual: 199.99,
      },
    };

    return plans[planType][billingCycle];
  };

  // Get plan features
  const getPlanFeatures = (planType: 'free' | 'standard' | 'premium'): string[] => {
    const features = {
      free: [
        'Up to 5 subscriptions',
        'Basic notifications',
        'Email support',
      ],
      standard: [
        'Up to 25 subscriptions',
        'SMS & Email notifications',
        'Advanced analytics',
        'Priority support',
        'Export data',
      ],
      premium: [
        'Unlimited subscriptions',
        'SMS, Email & WhatsApp notifications',
        'Advanced analytics & insights',
        'Priority support',
        'Export data',
        'Custom categories',
        'API access',
        'White-label options',
      ],
    };

    return features[planType];
  };

  return {
    // State
    isInitialized,
    isLoading,
    error,
    
    // Subscription info
    hasActiveSubscription,
    subscriptionPlan,
    expiresAt,
    
    // Actions
    processPayment,
    refreshSubscriptionStatus,
    
    // Helpers
    getPlanPrice,
    getPlanFeatures,
  };
}