import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import Link from 'next/link';
import { 
  CreditCard, 
  Bell, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Globe,
  CheckCircle,
  Star,
  TrendingDown,
  ArrowRight,
  Plus,
  Calendar,
  DollarSign
} from 'lucide-react';

const features = [
  {
    icon: CreditCard,
    title: 'Subscription Management',
    description: 'Track, organize, and manage all your recurring payments in one centralized dashboard.',
    href: '/features/subscriptions',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Visualize spending patterns and get AI-powered recommendations to optimize your budget.',
    href: '/features/analytics',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: DollarSign,
    title: 'Billing & Payments',
    description: 'Secure payment processing with comprehensive transaction history and reporting.',
    href: '/features/billing',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a payment with intelligent notifications via email, SMS, and push notifications.',
    href: '/features/reminders',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your financial data is protected with enterprise-grade encryption and security measures.',
    href: '/security',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Native iOS and Android apps for managing subscriptions on the go.',
    href: '/features/mobile',
    color: 'bg-teal-100 text-teal-600'
  }
];

const benefits = [
  'Track unlimited subscriptions',
  'Smart payment reminders',
  'Spending analytics & insights',
  'Secure data protection',
  'Mobile app access',
  'Export capabilities'
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Everything you need to take control of your subscriptions and optimize your spending
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <Link href={feature.href}>
                      <Button variant="outline" size="sm" className="group-hover:bg-purple-50 group-hover:border-purple-200">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
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
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of users who have taken control of their subscriptions with Subie. Start your free trial today.
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