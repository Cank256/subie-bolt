'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { AuthGuard } from '@/components/ui/auth-guard';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import { useAuth } from '@/hooks/use-auth';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Play,
  Music,
  Tv,
  Zap
} from 'lucide-react';

const iconMap = {
  tv: Tv,
  music: Music,
  play: Play,
  zap: Zap,
} as const;

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { user } = useAuth();
  const { subscriptions: data, loading, error } = useSubscriptions();

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Navbar isAuthenticated={true} />
          <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Navbar isAuthenticated={true} />
          <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Error loading subscriptions: {error}</p>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const totalMonthly = data.reduce((sum, sub) => {
    let monthlyAmount = sub.amount;
    switch (sub.billing_cycle) {
      case 'weekly':
        monthlyAmount = sub.amount * 4.33;
        break;
      case 'quarterly':
        monthlyAmount = sub.amount / 3;
        break;
      case 'semi_annual':
        monthlyAmount = sub.amount / 6;
        break;
      case 'annual':
        monthlyAmount = sub.amount / 12;
        break;
    }
    return sum + monthlyAmount;
  }, 0);

  const activeCount = data.filter(sub => sub.status === 'active').length;

  const nextPayment = data
    .filter(sub => sub.status === 'active')
    .sort((a, b) => new Date(a.next_payment_date).getTime() - new Date(b.next_payment_date).getTime())[0];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar isAuthenticated={true} />
        
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Your Subscriptions</h1>
                  <p className="text-gray-600 mt-2">Track and manage all your recurring payments</p>
                </div>
                <Button className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subscription
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalMonthly.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Estimated monthly spending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {data.length} total subscriptions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {nextPayment ? new Date(nextPayment.next_payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {nextPayment ? `${nextPayment.name} - $${nextPayment.amount}` : 'No upcoming payments'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Sort by: Price
                </Button>
              </div>
            </div>

            {/* Subscriptions List */}
            {data.length > 0 ? (
              <div className="grid gap-4">
                {data.map((subscription) => {
                  const IconComponent = subscription.subscription_categories?.icon && 
                    iconMap[subscription.subscription_categories.icon as keyof typeof iconMap] || Zap;
                  
                  return (
                    <Card key={subscription.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{subscription.name}</h3>
                              <p className="text-gray-600 text-sm">
                                {subscription.subscription_categories?.name || 'Other'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-semibold text-lg">
                                ${subscription.amount}/{subscription.billing_cycle === 'monthly' ? 'mo' : subscription.billing_cycle}
                              </p>
                              <p className="text-gray-600 text-sm">
                                Next: {new Date(subscription.next_payment_date).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              {subscription.status === 'active' && (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Active
                                </Badge>
                              )}
                              {subscription.status === 'paused' && (
                                <Badge variant="outline" className="text-orange-600 border-orange-200">
                                  Paused
                                </Badge>
                              )}
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No subscriptions yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start by adding your first subscription to track your spending
                  </p>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Subscription
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
}