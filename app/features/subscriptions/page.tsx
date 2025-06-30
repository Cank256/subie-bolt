import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import Link from 'next/link';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Play,
  Music,
  Tv,
  Zap,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Plus,
    title: 'Easy Subscription Adding',
    description: 'Quickly add subscriptions manually or connect your bank accounts for automatic detection.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Search,
    title: 'Smart Search & Filter',
    description: 'Find any subscription instantly with powerful search and filtering capabilities.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Calendar,
    title: 'Payment Tracking',
    description: 'Never miss a payment with clear next payment dates and renewal tracking.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: TrendingUp,
    title: 'Spending Analytics',
    description: 'Understand your subscription spending patterns with detailed analytics.',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: AlertCircle,
    title: 'Smart Alerts',
    description: 'Get notified about upcoming payments, price changes, and unused subscriptions.',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: Filter,
    title: 'Category Organization',
    description: 'Organize subscriptions by category for better management and insights.',
    color: 'bg-teal-100 text-teal-600'
  }
];

const mockSubscriptions = [
  {
    name: 'Netflix',
    price: 15.99,
    category: 'Entertainment',
    status: 'active',
    icon: Tv,
  },
  {
    name: 'Spotify Premium',
    price: 9.99,
    category: 'Music',
    status: 'active',
    icon: Music,
  },
  {
    name: 'Adobe Creative Suite',
    price: 52.99,
    category: 'Software',
    status: 'active',
    icon: Zap,
  }
];

const benefits = [
  'Track unlimited subscriptions',
  'Automatic payment detection',
  'Smart spending insights',
  'Payment reminders',
  'Category organization',
  'Export capabilities'
];

export default function SubscriptionFeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Subscription Management</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Take complete control of your recurring payments with our comprehensive subscription tracking and management tools.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Powerful Features</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">See It In Action</h2>
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Subscriptions Dashboard</CardTitle>
                  <Badge className="bg-green-100 text-green-800">Demo</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Monthly Total</p>
                        <p className="text-2xl font-bold">$78.97</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Services</p>
                        <p className="text-2xl font-bold">3</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Next Payment</p>
                        <p className="text-2xl font-bold">Feb 5</p>
                      </div>
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Subscriptions List */}
                <div className="space-y-3">
                  {mockSubscriptions.map((subscription, index) => {
                    const Icon = subscription.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{subscription.name}</h4>
                            <p className="text-sm text-gray-600">{subscription.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold">${subscription.price}/mo</span>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What You Get</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Subie?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Easy to Use</h4>
                    <p className="text-gray-600 text-sm">Intuitive interface that makes subscription management effortless</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Secure & Private</h4>
                    <p className="text-gray-600 text-sm">Bank-level security with encrypted data protection</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Smart Insights</h4>
                    <p className="text-gray-600 text-sm">AI-powered recommendations to optimize your spending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Take Control?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of users who have simplified their subscription management with Subie. Start your free trial today.
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