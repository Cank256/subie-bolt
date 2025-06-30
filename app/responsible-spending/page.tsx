import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { 
  TrendingDown, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  PiggyBank,
  Calculator,
  Target,
  BookOpen,
  Heart,
  DollarSign
} from 'lucide-react';

const spendingTips = [
  {
    icon: Calculator,
    title: 'Track Every Subscription',
    description: 'Keep a comprehensive list of all your recurring payments, no matter how small.',
  },
  {
    icon: Target,
    title: 'Set Monthly Budgets',
    description: 'Establish spending limits for different categories like entertainment, productivity, and utilities.',
  },
  {
    icon: AlertTriangle,
    title: 'Review Regularly',
    description: 'Schedule monthly reviews to evaluate which subscriptions you actually use and value.',
  },
  {
    icon: TrendingDown,
    title: 'Cancel Unused Services',
    description: 'Be honest about what you use. Cancel subscriptions that no longer provide value.',
  },
];

const budgetingStrategies = [
  {
    title: '50/30/20 Rule',
    description: 'Keep subscriptions within 30% of your income (wants category)',
    recommended: true,
  },
  {
    title: 'Fixed Amount Method',
    description: 'Set a specific dollar amount for all subscriptions combined',
    recommended: false,
  },
  {
    title: 'Value-Based Approach',
    description: 'Prioritize subscriptions based on daily/weekly usage',
    recommended: true,
  },
];

export default function ResponsibleSpendingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Responsible Spending</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to make informed decisions about your subscriptions and maintain healthy spending habits
            </p>
          </div>

          {/* Key Principles */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Core Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {spendingTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{tip.title}</h3>
                      <p className="text-gray-600 text-sm">{tip.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Budgeting Strategies */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PiggyBank className="w-6 h-6 mr-2 text-green-600" />
                    Budgeting Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {budgetingStrategies.map((strategy, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{strategy.title}</h4>
                        {strategy.recommended && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{strategy.description}</p>
                    </div>
                  ))}
                  
                  <div className="bg-blue-50 rounded-lg p-4 mt-6">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
                    <p className="text-blue-800 text-sm">
                      Start by calculating your current subscription total, then gradually optimize by canceling unused services and negotiating better rates.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Spending Health Check */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-6 h-6 mr-2 text-red-600" />
                    Spending Health Check
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Subscription vs Income</span>
                      <span>8%</span>
                    </div>
                    <Progress value={8} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">
                      Healthy range: 5-15% of income
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Usage Efficiency</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">
                      Based on active usage tracking
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="font-medium mb-2">Quick Actions</h5>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Review unused subscriptions
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Set spending alerts
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Warning Signs */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
                Warning Signs of Overspending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Forgetting What You Pay For</h4>
                      <p className="text-gray-600 text-sm">You can't quickly list all your active subscriptions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Surprise Charges</h4>
                      <p className="text-gray-600 text-sm">Regular unexpected charges on your statements</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Multiple Similar Services</h4>
                      <p className="text-gray-600 text-sm">Paying for overlapping or duplicate services</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Avoiding Account Reviews</h4>
                      <p className="text-gray-600 text-sm">Haven't checked subscription usage in months</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Financial Stress</h4>
                      <p className="text-gray-600 text-sm">Subscriptions causing budget strain or debt</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Auto-Renewal Anxiety</h4>
                      <p className="text-gray-600 text-sm">Worry about forgetting to cancel free trials</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                  Educational Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium">Subscription Psychology: Why We Overspend</h4>
                    <p className="text-gray-600 text-sm">Understanding the behavioral aspects of recurring payments</p>
                  </a>
                  
                  <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium">Building a Subscription Budget</h4>
                    <p className="text-gray-600 text-sm">Step-by-step guide to creating spending limits</p>
                  </a>

                  <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium">Negotiating Better Rates</h4>
                    <p className="text-gray-600 text-sm">Tips for reducing your monthly subscription costs</p>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-green-600" />
                  Financial Safety
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Emergency Protocol</h4>
                  <p className="text-green-800 text-sm mb-3">
                    If you're experiencing financial difficulty, take immediate action:
                  </p>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Cancel non-essential subscriptions immediately</li>
                    <li>• Contact providers to pause or reduce payments</li>
                    <li>• Prioritize basic needs over convenience services</li>
                    <li>• Seek financial counseling if needed</li>
                  </ul>
                </div>

                <div className="text-center">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Get Financial Help
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}