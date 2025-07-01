import { useState, useEffect, useCallback } from 'react';
import { Package, CustomerInfo } from '@revenuecat/purchases-js';
import { revenueCatService } from '@/lib/revenuecat/client';
import { useAuth } from './use-auth';
import { supabase } from '@/lib/supabase/client';
import { toast } from './use-toast';

interface UseRevenueCatReturn {
  // State
  isInitialized: boolean;
  isLoading: boolean;
  offerings: Package[];
  customerInfo: CustomerInfo | null;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  getOfferings: () => Promise<void>;
  purchasePackage: (pkg: Package, email?: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
  getCustomerInfo: () => Promise<void>;
  
  // Helpers
  hasActiveSubscription: boolean;
  subscriptionPlan: 'free' | 'standard' | 'premium';
  isSubscribed: (planType?: string) => boolean;
  getPackageByIdentifier: (identifier: string) => Package | null;
}

export function useRevenueCat(): UseRevenueCatReturn {
  const { user, profile } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offerings, setOfferings] = useState<Package[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'standard' | 'premium'>('free');

  // Initialize RevenueCat
  const initialize = useCallback(async () => {
    if (isInitialized) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await revenueCatService.initialize();
      
      // If user is logged in, log them into RevenueCat
      if (user?.id) {
        await revenueCatService.loginUser(user.id);
      }
      
      setIsInitialized(true);
      
      // Fetch initial data
      await Promise.all([
        getOfferings(),
        getCustomerInfo()
      ]);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize RevenueCat';
      setError(errorMessage);
      console.error('RevenueCat initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, user?.id]);

  // Get available offerings
  const getOfferings = useCallback(async () => {
    if (!isInitialized) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedOfferings = await revenueCatService.getOfferings();
      setOfferings(fetchedOfferings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch offerings';
      setError(errorMessage);
      console.error('Error fetching offerings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Get customer info
  const getCustomerInfo = useCallback(async () => {
    if (!isInitialized) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const info = await revenueCatService.getCustomerInfo();
      setCustomerInfo(info);
      
      // Update subscription status
      const hasActive = await revenueCatService.checkActiveSubscriptions();
      const plan = await revenueCatService.getSubscriptionPlan();
      
      setHasActiveSubscription(hasActive);
      setSubscriptionPlan(plan);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customer info';
      setError(errorMessage);
      console.error('Error fetching customer info:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Purchase a package
  const purchasePackage = useCallback(async (pkg: Package, email?: string) => {
    if (!isInitialized) {
      throw new Error('RevenueCat not initialized');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await revenueCatService.purchasePackage(pkg, email);
      
      // Update customer info after successful purchase
      await getCustomerInfo();
      
      toast({
        title: 'Purchase Successful!',
        description: 'Your subscription has been activated.',
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      setError(errorMessage);
      
      toast({
        title: 'Purchase Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, getCustomerInfo]);

  // Restore purchases
  const restorePurchases = useCallback(async () => {
    if (!isInitialized) {
      throw new Error('RevenueCat not initialized');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const customerInfo = await revenueCatService.restorePurchases();
      setCustomerInfo(customerInfo);
      
      // Update subscription status
      const hasActive = await revenueCatService.checkActiveSubscriptions();
      const plan = await revenueCatService.getSubscriptionPlan();
      
      setHasActiveSubscription(hasActive);
      setSubscriptionPlan(plan);
      
      toast({
        title: 'Purchases Restored',
        description: 'Your previous purchases have been restored.',
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore purchases';
      setError(errorMessage);
      
      toast({
        title: 'Restore Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Helper function to check if user is subscribed to a specific plan
  const isSubscribed = useCallback((planType?: string) => {
    if (!customerInfo) return false;
    
    if (planType) {
      return customerInfo.activeSubscriptions.has(planType);
    }
    
    return hasActiveSubscription;
  }, [customerInfo, hasActiveSubscription]);

  // Helper function to get a package by its identifier
  const getPackageByIdentifier = useCallback((identifier: string): Package | null => {
    return offerings.find(pkg => pkg.identifier === identifier) || null;
  }, [offerings]);

  // Auto-initialize when user changes
  useEffect(() => {
    if (user && !isInitialized) {
      initialize();
    }
  }, [user, isInitialized, initialize]);

  // Handle user login/logout
  useEffect(() => {
    if (!isInitialized) return;
    
    const handleAuthChange = async () => {
      try {
        if (user?.id) {
          await revenueCatService.loginUser(user.id);
          await getCustomerInfo();
        } else {
          await revenueCatService.logoutUser();
          setCustomerInfo(null);
          setHasActiveSubscription(false);
          setSubscriptionPlan('free');
        }
      } catch (err) {
        console.error('Error handling auth change:', err);
      }
    };
    
    handleAuthChange();
  }, [user?.id, isInitialized, getCustomerInfo]);

  return {
    // State
    isInitialized,
    isLoading,
    offerings,
    customerInfo,
    error,
    
    // Actions
    initialize,
    getOfferings,
    purchasePackage,
    restorePurchases,
    getCustomerInfo,
    
    // Helpers
    hasActiveSubscription,
    subscriptionPlan,
    isSubscribed,
    getPackageByIdentifier,
  };
}