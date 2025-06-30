import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import Link from 'next/link';
import { 
  CreditCard, 
  Download, 
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Shield,
  Clock,
  FileText,
  Star,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: CreditCard,
    title: 'Payment Method Management',
    description: 'Securely store and manage multiple payment methods with bank-level encryption.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: FileText,
    title: 'Transaction History',
    description: 'Complete history of all subscription payments with detailed transaction records.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Download,
    title: 'Export & Reports',
    description: 'Export payment data and generate detailed reports for accounting and budgeting.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: AlertCircle,
    title: 'Failed Payment Alerts',
    description: 'Instant notifications for failed payments with actionable resolution steps.',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: Calendar,
    title: 'Payment Calendar',
    description: 'Visual calendar showing all upcoming payments and billing cycles.',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Shield,
    title: 'Secure Processing',
    description: 'PCI DSS compliant payment processing with industry-leading security.',
    color: 'bg-teal-100 text-teal-600'
  }
];

const mockTransactions = [
  {
    service: 'Netflix',
    amount: 15.99,
    date: '2025-01-15',
    status: 'completed'
  },
  {
    service: 'Spotify Premium',
    amount: 9.99,
    date: '2025-01-10',
    status: 'completed'
  },
  {
    service: 'Adobe Creative Suite',
    amount: 52.99,
    date: '2025-01-01',
    status: 'completed'
  }
];

const benefits = [
  'Secure payment method storage',
  'Complete transaction history',
  'Failed payment notifications',
  'Export capabilities',
  'Payment calendar view',
  'Spending analytics'
];

export default function BillingFeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Billing & Payment Management</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Keep track of all your subscription payments with comprehensive billing management tools and secure payment processing.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Billing Features</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Billing Dashboard Preview</h2>
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Billing & Payments</CardTitle>
                  <Badge className="bg-green-100 text-green-800">Demo</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">This Month</p>
                        <p className="text-2xl font-bold">$78.97</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Successful</p>
                        <p className="text-2xl font-bold">3</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Failed</p>
                        <p className="text-2xl font-bold text-red-600">0</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Payment Methods</h4>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-5 bg-blue-600 rounded mr-3"></div>
                          <span className="font-medium">•••• 4242</span>
                        </div>
                        <Badge>Primary</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Expires 12/27</p>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <h4 className="font-semibold mb-3">Recent Transactions</h4>
                  <div className="space-y-3">
                    {mockTransactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-sm">{transaction.service}</h5>
                            <p className="text-xs text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-sm">${transaction.amount}</span>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Paid
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Benefits</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Security & Trust</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Bank-Level Security</h4>
                    <p className="text-gray-600 text-sm">256-bit SSL encryption and PCI DSS compliance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Real-Time Processing</h4>
                    <p className="text-gray-600 text-sm">Instant payment tracking and notifications</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Trusted by Thousands</h4>
                    <p className="text-gray-600 text-sm">Join users who trust us with their billing data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Simplify Your Billing Today</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Take control of your subscription payments with secure, comprehensive billing management. Start your free trial now.
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