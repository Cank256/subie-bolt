import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { AuthGuard } from '@/components/ui/auth-guard';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart,
  Target,
  AlertCircle,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

const mockAnalytics = {
  totalSpending: 90.96,
  monthlyChange: 2.5,
  activeSubscriptions: 4,
  avgPerSubscription: 22.74,
  categoryBreakdown: [
    { category: 'Entertainment', amount: 27.98, percentage: 31, color: 'bg-purple-500' },
    { category: 'Software', amount: 52.99, percentage: 58, color: 'bg-blue-500' },
    { category: 'Music', amount: 9.99, percentage: 11, color: 'bg-green-500' },
  ],
  monthlyTrend: [
    { month: 'Sep', amount: 85.50 },
    { month: 'Oct', amount: 88.75 },
    { month: 'Nov', amount: 92.25 },
    { month: 'Dec', amount: 89.50 },
    { month: 'Jan', amount: 90.96 },
  ],
  upcomingPayments: [
    { service: 'YouTube Premium', amount: 11.99, date: '2025-02-05', daysUntil: 3 },
    { service: 'Spotify Premium', amount: 9.99, date: '2025-02-10', daysUntil: 8 },
    { service: 'Netflix', amount: 15.99, date: '2025-02-15', daysUntil: 13 },
  ]
};

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
                  <p className="text-gray-600 mt-2">Understand your subscription spending patterns and trends</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Monthly Spending</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${mockAnalytics.totalSpending}</div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{mockAnalytics.monthlyChange}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.activeSubscriptions}</div>
                  <p className="text-xs text-muted-foreground">
                    Tracking all services
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average per Service</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${mockAnalytics.avgPerSubscription}</div>
                  <p className="text-xs text-muted-foreground">
                    Per subscription
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.upcomingPayments[0].daysUntil}d</div>
                  <p className="text-xs text-muted-foreground">
                    {mockAnalytics.upcomingPayments[0].service}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Spending by Category */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="w-5 h-5 mr-2" />
                      Spending by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {mockAnalytics.categoryBreakdown.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                            <span className="font-medium">{category.category}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">${category.amount}</span>
                            <span className="text-gray-500 text-sm ml-2">({category.percentage}%)</span>
                          </div>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Payments */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Upcoming Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockAnalytics.upcomingPayments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-sm">{payment.service}</h4>
                          <p className="text-xs text-gray-600">
                            {payment.daysUntil} days
                          </p>
                        </div>
                        <span className="font-semibold text-sm">${payment.amount}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Monthly Trend */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Monthly Spending Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {mockAnalytics.monthlyTrend.map((month, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-md mb-2 min-h-[20px]"
                        style={{ 
                          height: `${(month.amount / Math.max(...mockAnalytics.monthlyTrend.map(m => m.amount))) * 200}px` 
                        }}
                      ></div>
                      <span className="text-xs font-medium">{month.month}</span>
                      <span className="text-xs text-gray-600">${month.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">💡 Cost Savings Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Bundle Opportunity</h4>
                    <p className="text-green-800 text-sm">
                      Consider bundling your streaming services. You could save up to $8/month with a Disney+ bundle.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Annual Billing</h4>
                    <p className="text-blue-800 text-sm">
                      Switch to annual billing for Adobe Creative Suite to save $63.48 per year.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Usage Review</h4>
                    <p className="text-purple-800 text-sm">
                      You haven&apos;t used Netflix in 2 weeks. Consider pausing or canceling to save $15.99/month.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">📊 Spending Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Most Expensive</h4>
                      <p className="text-sm text-gray-600">Adobe Creative Suite</p>
                    </div>
                    <span className="font-semibold">$52.99</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Best Value</h4>
                      <p className="text-sm text-gray-600">Spotify Premium</p>
                    </div>
                    <span className="font-semibold text-green-600">High Usage</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Category Leader</h4>
                      <p className="text-sm text-gray-600">Software (58% of spending)</p>
                    </div>
                    <span className="font-semibold">$52.99</span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Spending vs. Budget</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Monthly Budget: $100</span>
                      <span className="text-sm font-medium">91% used</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
}