'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Purchases, Package, CustomerInfo } from '@revenuecat/purchases-js';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

interface RevenueCatContextType {
  // State
  isInitialized: boolean;
  isLoading: boolean;
  offerings: Package[];
  customerInfo: CustomerInfo | null;
  error: string | null;
  
  // Subscription info
  hasActiveSubscription: boolean;
  subscriptionPlan: 'free' | 'standard' | 'premium';
  
  // Actions
  purchasePackage: (pkg: Package) => Promise<CustomerInfo>;
  restorePurchases: () => Promise<CustomerInfo>;
  refreshCustomerInfo: () => Promise<void>;
  
  // Helpers
  getPackageByIdentifier: (identifier: string) => Package | null;
  hasEntitlement: (entitlementId: string) => boolean;
}

const RevenueCatContext = createContext<RevenueCatContextType | null>(null);

export function useRevenueCatContext() {
  const context = useContext(RevenueCatContext);
  if (!context) {
    throw new Error('useRevenueCatContext must be used within a RevenueCatProvider');
  }
  return context;
}

interface RevenueCatProviderProps {
  children: React.ReactNode;
}

export function RevenueCatProvider({ children }: RevenueCatProviderProps) {
  const { user } = useAuth();
  
  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [offerings, setOfferings] = useState<Package[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'standard' | 'premium'>('free');

  // Initialize RevenueCat
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if RevenueCat API key is available
        const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY;
        if (!apiKey || apiKey === 'your_revenuecat_public_api_key') {
          console.warn('RevenueCat API key not found or not configured. Subscription features will be disabled.');
          setError('RevenueCat API key not configured. Please set NEXT_PUBLIC_REVENUECAT_API_KEY in your environment variables.');
          setIsLoading(false);
          return;
        }

        // Configure RevenueCat
        Purchases.configure({
          apiKey,
          appUserId: user?.id || 'undefined-user-id',
        });
        
        setIsInitialized(true);
        
        // Fetch initial data
        await Promise.all([
          fetchOfferings(),
          fetchCustomerInfo(),
        ]);
        
      } catch (err) {
        console.error('Failed to initialize RevenueCat:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize RevenueCat');
      } finally {
        setIsLoading(false);
      }
    };

    initializeRevenueCat();
  }, [user?.id]);

  // Fetch offerings
  const fetchOfferings = async () => {
    try {
      const offeringsResponse = await Purchases.getSharedInstance().getOfferings();
      
      // Collect all packages from all offerings
      const allPackages: Package[] = [];
      
      if (offeringsResponse.current) {
        allPackages.push(...offeringsResponse.current.availablePackages);
      }
      
      // Add packages from other offerings
      Object.values(offeringsResponse.all).forEach(offering => {
        allPackages.push(...offering.availablePackages);
      });
      
      setOfferings(allPackages);
      
    } catch (err) {
      console.error('Failed to fetch offerings:', err);
      throw err;
    }
  };

  // Fetch customer info
  const fetchCustomerInfo = async () => {
    try {
      const info = await Purchases.getSharedInstance().getCustomerInfo();
      setCustomerInfo(info);
      
      // Update subscription status
      const hasActive = Object.keys(info.entitlements.active).length > 0;
      setHasActiveSubscription(hasActive);
      
      // Determine subscription plan
      if (info.entitlements.active['premium']) {
        setSubscriptionPlan('premium');
      } else if (info.entitlements.active['standard']) {
        setSubscriptionPlan('standard');
      } else {
        setSubscriptionPlan('free');
      }
      
    } catch (err) {
      console.error('Failed to fetch customer info:', err);
      throw err;
    }
  };

  // Purchase package
  const purchasePackage = async (pkg: Package): Promise<CustomerInfo> => {
    try {
      setIsLoading(true);
      
      const { customerInfo } = await Purchases.getSharedInstance().purchasePackage(pkg);
      
      setCustomerInfo(customerInfo);
      
      // Update subscription status
      const hasActive = Object.keys(customerInfo.entitlements.active).length > 0;
      setHasActiveSubscription(hasActive);
      
      // Determine subscription plan
      if (customerInfo.entitlements.active['premium']) {
        setSubscriptionPlan('premium');
      } else if (customerInfo.entitlements.active['standard']) {
        setSubscriptionPlan('standard');
      } else {
        setSubscriptionPlan('free');
      }
      
      toast({
        title: 'Purchase Successful!',
        description: 'Your subscription has been activated.',
      });
      
      return customerInfo;
      
    } catch (err) {
      console.error('Purchase failed:', err);
      
      toast({
        title: 'Purchase Failed',
        description: err instanceof Error ? err.message : 'An error occurred during purchase.',
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Restore purchases (Web SDK automatically restores when getting customer info)
  const restorePurchases = async (): Promise<CustomerInfo> => {
    try {
      setIsLoading(true);
      // In the web SDK, calling getCustomerInfo() automatically restores purchases
      const customerInfo = await Purchases.getSharedInstance().getCustomerInfo();
      
      setCustomerInfo(customerInfo);
      
      // Update subscription status
      const hasActive = Object.keys(customerInfo.entitlements.active).length > 0;
      setHasActiveSubscription(hasActive);
      
      // Determine subscription plan
      if (customerInfo.entitlements.active['premium']) {
        setSubscriptionPlan('premium');
      } else if (customerInfo.entitlements.active['standard']) {
        setSubscriptionPlan('standard');
      } else {
        setSubscriptionPlan('free');
      }
      
      toast({
        title: 'Purchases Restored',
        description: 'Your previous purchases have been restored.',
      });
      
      return customerInfo;
      
    } catch (err) {
      console.error('Restore failed:', err);
      
      toast({
        title: 'Restore Failed',
        description: err instanceof Error ? err.message : 'Failed to restore purchases.',
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh customer info
  const refreshCustomerInfo = async () => {
    try {
      await fetchCustomerInfo();
    } catch (err) {
      console.error('Failed to refresh customer info:', err);
    }
  };

  // Get package by identifier
  const getPackageByIdentifier = (identifier: string): Package | null => {
    return offerings.find(pkg => pkg.identifier === identifier) || null;
  };

  // Check if user has specific entitlement
  const hasEntitlement = (entitlementId: string): boolean => {
    if (!customerInfo) return false;
    
    const entitlement = customerInfo.entitlements.active[entitlementId];
    return entitlement?.isActive || false;
  };

  const value: RevenueCatContextType = {
    // State
    isInitialized,
    isLoading,
    offerings,
    customerInfo,
    error,
    
    // Subscription info
    hasActiveSubscription,
    subscriptionPlan,
    
    // Actions
    purchasePackage,
    restorePurchases,
    refreshCustomerInfo,
    
    // Helpers
    getPackageByIdentifier,
    hasEntitlement,
  };

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
}