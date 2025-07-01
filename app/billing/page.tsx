'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRevenueCat } from '@/hooks/use-revenuecat';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  XCircle,
  Crown,
  Settings,
  RefreshCw,
  Download,
  AlertCircle,
} from 'lucide-react';
import { AuthGuard } from '@/components/ui/auth-guard';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';

// Mock data for demonstration
const mockTransactions = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Premium Subscription',
    amount: 29.99,
    status: 'completed',
    method: 'Credit Card',
  },
  {
    id: '2',
    date: '2024-01-01',
    description: 'Standard Plan',
    amount: 19.99,
    status: 'completed',
    method: 'PayPal',
  },
  {
    id: '3',
    date: '2023-12-15',
    description: 'Premium Subscription',
    amount: 29.99,
    status: 'failed',
    method: 'Credit Card',
  },
  {
    id: '4',
    date: '2023-12-01',
    description: 'Standard Plan',
    amount: 19.99,
    status: 'completed',
    method: 'Credit Card',
  },
];

const mockPaymentMethods = [
  {
    id: '1',
    type: 'Credit Card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: '2',
    type: 'PayPal',
    email: 'user@example.com',
    isDefault: false,
  },
];

export default function BillingPage() {
  const { user } = useAuth();
  const {
    customerInfo,
    isLoading,
    error,
    hasActiveSubscription,
    subscriptionPlan,
    restorePurchases,
    getCustomerInfo,
  } = useRevenueCat();
  
  const [isRestoring, setIsRestoring] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle restore purchases
  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      await restorePurchases();
    } catch (error) {
      console.error('Failed to restore purchases:', error);
    } finally {
      setIsRestoring(false);
    }
  };

  // Handle refresh subscription info
  const handleRefreshSubscription = async () => {
    setIsRefreshing(true);
    try {
      await getCustomerInfo();
    } catch (error) {
      console.error('Failed to refresh subscription:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get subscription status display
  const getSubscriptionStatus = () => {
    if (!hasActiveSubscription) return 'Free Plan';
    
    switch (subscriptionPlan) {
      case 'premium':
        return 'Premium Plan';
      case 'standard':
        return 'Standard Plan';
      default:
        return 'Free Plan';
    }
  };

  // Get next billing date
  const getNextBillingDate = () => {
    if (!customerInfo || !hasActiveSubscription) return null;
    
    // Get the latest expiration date from active entitlements
    const activeEntitlements = Object.values(customerInfo.entitlements.active);
    if (activeEntitlements.length === 0) return null;
    
    const latestExpiration = activeEntitlements.reduce((latest, entitlement) => {
      if (!entitlement.expirationDate) return latest;
      const expirationDate = new Date(entitlement.expirationDate);
      return expirationDate > latest ? expirationDate : latest;
    }, new Date(0));
    
    return latestExpiration.toLocaleDateString();
  };

  // Calculate stats from mock data
  const monthlyTotal = mockTransactions
    .filter(t => t.status === 'completed' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);
  
  const successfulPayments = mockTransactions.filter(t => t.status === 'completed').length;
  const failedPayments = mockTransactions.filter(t => t.status === 'failed').length;

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please sign in to view your billing information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
                  <p className="text-gray-600 mt-2">Manage your subscription and view transaction history</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleRefreshSubscription}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRestorePurchases}
                    disabled={isLoading}
                  >
                    Restore Purchases
                  </Button>
                </div>
              </div>
            </div>

            {/* Current Subscription Status */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2" />
                  Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg">{getSubscriptionStatus()}</h3>
                    <p className="text-gray-600">
                      {hasActiveSubscription ? 'Active subscription' : 'No active subscription'}
                    </p>
                  </div>
                  
                  {hasActiveSubscription && (
                    <div>
                      <h4 className="font-medium">Next Billing Date</h4>
                      <p className="text-gray-600">{getNextBillingDate()}</p>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Link href="/pricing">
                      <Button variant="outline">
                        {hasActiveSubscription ? 'Change Plan' : 'Upgrade Plan'}
                      </Button>
                    </Link>
                    {hasActiveSubscription && (
                      <Button variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${monthlyTotal.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockTransactions.filter(t => t.status === 'completed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Out of {mockTransactions.length} total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {mockTransactions.filter(t => t.status === 'failed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Needs attention
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Methods */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-5 bg-blue-600 rounded mr-2"></div>
                          <span className="font-medium">•••• 4242</span>
                        </div>
                        <Badge>Primary</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Expires 12/27</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-5 bg-red-600 rounded mr-2"></div>
                          <span className="font-medium">•••• 8888</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Expires 03/26</p>
                    </div>

                    <Button variant="outline" className="w-full">
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction History */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Transactions</CardTitle>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{transaction.description}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(transaction.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold">${transaction.amount}</span>
                            <Badge 
                              variant={transaction.status === 'completed' ? 'default' : 'destructive'}
                              className={transaction.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                            >
                              {transaction.status === 'completed' ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Paid
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Failed
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Upcoming Payments */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">YouTube Premium</h4>
                        <p className="text-sm text-gray-600">Due Feb 5, 2025</p>
                      </div>
                      <span className="font-semibold text-orange-600">$11.99</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Spotify Premium</h4>
                        <p className="text-sm text-gray-600">Due Feb 10, 2025</p>
                      </div>
                      <span className="font-semibold">$9.99</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
}