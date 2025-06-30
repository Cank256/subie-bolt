import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  PieChart,
  Target,
  AlertCircle,
  Calendar,
  CheckCircle,
  Star,
  ArrowRight,
  Lightbulb,
  Eye
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Spending Analytics',
    description: 'Comprehensive charts and graphs showing your subscription spending patterns over time.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: PieChart,
    title: 'Category Breakdown',
    description: 'Visual breakdown of spending by category to identify where your money goes.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: TrendingUp,
    title: 'Trend Analysis',
    description: 'Track spending trends and identify patterns in your subscription usage.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Target,
    title: 'Budget Tracking',
    description: 'Set budgets and track your progress with visual indicators and alerts.',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Lightbulb,
    title: 'Smart Insights',
    description: 'AI-powered recommendations to optimize your subscription portfolio.',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    icon: Eye,
    title: 'Usage Monitoring',
    description: 'Track which subscriptions you actually use and identify potential savings.',
    color: 'bg-teal-100 text-teal-600'
  }
];

const mockAnalytics = {
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
  ]
};

const insights = [
  {
    type: 'savings',
    title: 'Bundle Opportunity',
    description: 'You could save $8/month by bundling your streaming services',
    color: 'bg-green-50 border-green-200 text-green-800'
  },
  {
    type: 'warning',
    title: 'Unused Service',
    description: 'Netflix hasn\'t been used in 2 weeks - consider pausing',
    color: 'bg-orange-50 border-orange-200 text-orange-800'
  },
  {
    type: 'info',
    title: 'Annual Billing',
    description: 'Switch to annual billing to save $63.48 per year',
    color: 'bg-blue-50 border-blue-200 text-blue-800'
  }
];

const benefits = [
  'Visual spending dashboards',
  'Category-based analytics',
  'Trend analysis and forecasting',
  'Budget tracking and alerts',
  'AI-powered insights',
  'Usage monitoring'
];

export default function AnalyticsFeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics & Insights</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Understand your subscription spending with powerful analytics, visual dashboards, and AI-powered insights to optimize your budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In to Access
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Analytics Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Demo Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Analytics Dashboard Preview</h2>
            <Card className="max-w-5xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Analytics & Insights</CardTitle>
                  <Badge className="bg-green-100 text-green-800">Demo</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Monthly Spending</p>
                        <p className="text-2xl font-bold">$90.96</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Services</p>
                        <p className="text-2xl font-bold">4</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Average Cost</p>
                        <p className="text-2xl font-bold">$22.74</p>
                      </div>
                      <Target className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Trend</p>
                        <p className="text-2xl font-bold text-green-600">+2.5%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Category Breakdown */}
                  <div>
                    <h4 className="font-semibold mb-4">Spending by Category</h4>
                    <div className="space-y-4">
                      {mockAnalytics.categoryBreakdown.map((category, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                              <span className="font-medium text-sm">{category.category}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-sm">${category.amount}</span>
                              <span className="text-gray-500 text-xs ml-2">({category.percentage}%)</span>
                            </div>
                          </div>
                          <Progress value={category.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Trend */}
                  <div>
                    <h4 className="font-semibold mb-4">Monthly Trend</h4>
                    <div className="h-32 flex items-end justify-between space-x-2">
                      {mockAnalytics.monthlyTrend.map((month, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-md mb-2 min-h-[10px]"
                            style={{ 
                              height: `${(month.amount / Math.max(...mockAnalytics.monthlyTrend.map(m => m.amount))) * 100}px` 
                            }}
                          ></div>
                          <span className="text-xs font-medium">{month.month}</span>
                          <span className="text-xs text-gray-600">${month.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Smart Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {insights.map((insight, index) => (
                <Card key={index} className={`border-2 ${insight.color}`}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{insight.title}</h4>
                    <p className="text-sm">{insight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Benefits</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Analytics Matter</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Optimize Spending</h4>
                    <p className="text-gray-600 text-sm">Identify opportunities to reduce costs and eliminate waste</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Gain Visibility</h4>
                    <p className="text-gray-600 text-sm">See exactly where your money goes each month</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Make Better Decisions</h4>
                    <p className="text-gray-600 text-sm">Data-driven insights for smarter subscription choices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Unlock Your Spending Insights</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Discover hidden patterns in your subscription spending and optimize your budget with powerful analytics. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}