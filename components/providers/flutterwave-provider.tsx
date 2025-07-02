'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { flutterwaveService } from '@/lib/flutterwave/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

interface FlutterwaveContextType {
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
}

const FlutterwaveContext = createContext<FlutterwaveContextType | null>(null);

export function useFlutterwaveContext() {
  const context = useContext(FlutterwaveContext);
  if (!context) {
    throw new Error('useFlutterwaveContext must be used within a FlutterwaveProvider');
  }
  return context;
}

interface FlutterwaveProviderProps {
  children: React.ReactNode;
}

export function FlutterwaveProvider({ children }: FlutterwaveProviderProps) {
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
        
        // Check if Flutterwave public key is available
        const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
        if (!publicKey || publicKey === 'your_flutterwave_public_key') {
          console.warn('Flutterwave public key not found or not configured. Subscription features will be disabled.');
          setError('Flutterwave public key not configured. Please set NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY in your environment variables.');
          setIsLoading(false);
          return;
        }

        // Initialize Flutterwave
        await flutterwaveService.initialize();
        setIsInitialized(true);
        
        // Fetch subscription status if user is logged in
        if (user?.id) {
          await fetchSubscriptionStatus();
        }
        
      } catch (err) {
        console.error('Failed to initialize Flutterwave:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize Flutterwave');
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

    if (!user?.email || !user?.user_metadata?.full_name) {
      throw new Error('User information not available');
    }

    try {
      setIsLoading(true);
      
      await flutterwaveService.processSubscriptionPayment(
        planType,
        billingCycle,
        user.email,
        user.user_metadata.full_name || 'User'
      );
      
      // Refresh subscription status after payment
      await fetchSubscriptionStatus();
      
      toast({
        title: 'Payment Initiated',
        description: 'Please complete the payment process.',
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

  const value: FlutterwaveContextType = {
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
  };

  return (
    <FlutterwaveContext.Provider value={value}>
      {children}
    </FlutterwaveContext.Provider>
  );
}