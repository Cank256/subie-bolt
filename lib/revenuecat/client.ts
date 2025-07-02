import { Purchases, CustomerInfo, Offering, Package } from '@revenuecat/purchases-js';
import { supabase } from '../supabase/client';
import { auth } from '../supabase/auth';
import type { Database } from '../supabase/types';

type UserProfile = Database['public']['Tables']['users']['Row'];

class RevenueCatService {
  private static instance: RevenueCatService;
  private purchases: Purchases | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY;
    if (!apiKey || apiKey === 'your_revenuecat_public_api_key') {
      console.warn('RevenueCat API key not found or not configured. Please set NEXT_PUBLIC_REVENUECAT_API_KEY in your environment variables.');
      throw new Error('RevenueCat API key not configured. Please set a valid NEXT_PUBLIC_REVENUECAT_API_KEY in your environment variables.');
    }

    try {
      // Generate anonymous user ID if no user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      const appUserId = user?.id || Purchases.generateRevenueCatAnonymousAppUserId();

      this.purchases = Purchases.configure({
        apiKey,
        appUserId
      });
      this.isInitialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async loginUser(userId: string): Promise<void> {
    if (!this.purchases) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      await this.purchases.changeUser(userId);
      console.log('User logged in to RevenueCat:', userId);
    } catch (error) {
      console.error('Failed to login user to RevenueCat:', error);
      throw error;
    }
  }

  async logoutUser(): Promise<void> {
    if (!this.purchases) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      const anonymousId = Purchases.generateRevenueCatAnonymousAppUserId();
      await this.purchases.changeUser(anonymousId);
      console.log('User logged out from RevenueCat');
    } catch (error) {
      console.error('Failed to logout user from RevenueCat:', error);
      throw error;
    }
  }

  async getOfferings(): Promise<Package[]> {
    if (!this.purchases) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      const offerings = await this.purchases.getOfferings();
      return offerings.current?.availablePackages || [];
    } catch (error) {
      console.error('Failed to get offerings:', error);
      throw error;
    }
  }

  async purchasePackage(packageToPurchase: Package, customerEmail?: string): Promise<any> {
    if (!this.purchases) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      const result = await this.purchases.purchase({
        rcPackage: packageToPurchase,
        customerEmail
      });
      
      // Sync with Supabase after successful purchase
      await this.syncWithSupabase(result.customerInfo);
      
      return result;
    } catch (error) {
      console.error('Failed to purchase package:', error);
      throw error;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    if (!this.purchases) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      return await this.purchases.getCustomerInfo();
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    try {
      if (!this.purchases) {
        throw new Error('RevenueCat not initialized');
      }

      // In the web SDK, calling getCustomerInfo() automatically restores purchases
      // There is no separate restorePurchases method in the web SDK
      const customerInfo = await this.purchases.getCustomerInfo();
      
      // Sync with Supabase after getting customer info
      await this.syncWithSupabase(customerInfo);
      
      return customerInfo;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }

  async checkActiveSubscriptions(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return customerInfo.activeSubscriptions.size > 0;
    } catch (error) {
      console.error('Failed to check active subscriptions:', error);
      return false;
    }
  }

  async getSubscriptionPlan(): Promise<'free' | 'standard' | 'premium'> {
    try {
      const customerInfo = await this.getCustomerInfo();
      
      if (customerInfo.activeSubscriptions.has('premium_monthly') || 
          customerInfo.activeSubscriptions.has('premium_annual')) {
        return 'premium';
      } else if (customerInfo.activeSubscriptions.has('standard_monthly') || 
                 customerInfo.activeSubscriptions.has('standard_annual')) {
        return 'standard';
      }
      
      return 'free';
    } catch (error) {
      console.error('Failed to get subscription plan:', error);
      return 'free';
    }
  }

  private async syncWithSupabase(customerInfo: CustomerInfo): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const subscriptionPlan = await this.getSubscriptionPlan();
      
      // Get the latest expiration date from active entitlements
      let latestExpirationDate: Date | null = null;
      const activeEntitlements = Object.values(customerInfo.entitlements.active);
      
      for (const entitlement of activeEntitlements) {
        const expirationDate: Date | null = entitlement.expirationDate;
        if (expirationDate && (!latestExpirationDate || expirationDate > latestExpirationDate)) {
          latestExpirationDate = expirationDate;
        }
      }

      // Update user profile in Supabase
      const planExpiresAt: string | null = latestExpirationDate ? latestExpirationDate.toISOString() : null;
      await auth.updateUserProfile(user.id, {
        subscription_plan: subscriptionPlan,
        plan_expires_at: planExpiresAt,
      });

      console.log('Successfully synced RevenueCat data with Supabase');
    } catch (error) {
      console.error('Failed to sync with Supabase:', error);
    }
  }
}

export const revenueCatService = RevenueCatService.getInstance();