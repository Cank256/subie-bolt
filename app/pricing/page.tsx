'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import Link from 'next/link';
import { 
  Check, 
  Star, 
  Zap,
  Crown,
  Shield,
  ArrowRight,
  CreditCard,
  BarChart3,
  Bell,
  Smartphone,
  Mail,
  MessageSquare,
  Download,
  Calendar,
  X
} from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started with basic subscription tracking',
    features: [
      'Track up to 10 subscriptions',
      'Email notifications & reminders',
      'Basic spending overview',
      'Mobile app access',
      'Community support'
    ],
    limitations: [
      'Limited to 10 subscriptions',
      'Email notifications only',
      'Basic analytics only'
    ],
    cta: 'Get Started Free',
    popular: false,
    icon: CreditCard
  },
  {
    name: 'Standard',
    priceMonthly: 2.99,
    priceAnnual: 29.99,
    period: 'month',
    description: 'Everything you need for comprehensive subscription management',
    features: [
      'Unlimited subscriptions',
      'Unlimited email notifications',
      '50 SMS/WhatsApp messages per month',
      'Advanced analytics & insights',
      'Smart payment reminders',
      'Bank account integration',
      'Mobile app with notifications',
      'Priority email support'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: true,
    icon: BarChart3
  },
  {
    name: 'Premium',
    priceMonthly: 5.99,
    priceAnnual: 59.99,
    period: 'month',
    description: 'Advanced features for power users',
    features: [
      'Everything in Standard',
      '300 SMS/WhatsApp messages per month',
      'Export data (CSV/ICS formats)',
      'Calendar sync integration',
      'Advanced reporting & analytics',
      'Priority support',
      'Early access to new features',
      'Custom notification schedules'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: false,
    icon: Crown
  }
];

const faqs = [
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Standard and Premium plans come with a 14-day free trial. No credit card required to start.'
  },
  {
    question: 'What are SMS/WhatsApp messages?',
    answer: 'These are text message notifications sent to your phone for payment reminders and important updates about your subscriptions.'
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. You can cancel your subscription at any time with no cancellation fees. You\'ll retain access until the end of your billing period.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
  },
  {
    question: 'Do unused SMS/WhatsApp messages roll over?',
    answer: 'No, unused messages don\'t roll over to the next month. Your message allowance resets at the beginning of each billing cycle.'
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const getPrice = (plan: any) => {
    if (plan.name === 'Free') return 0;
    return isAnnual ? plan.priceAnnual : plan.priceMonthly;
  };

  const getPeriod = (plan: any) => {
    if (plan.name === 'Free') return 'forever';
    return isAnnual ? 'year' : 'month';
  };

  const getSavings = (plan: any) => {
    if (plan.name === 'Free' || !plan.priceAnnual) return null;
    const monthlyCost = plan.priceMonthly * 12;
    const savings = Math.round(((monthlyCost - plan.priceAnnual) / monthlyCost) * 100);
    return savings;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the plan that's right for you. Start free and upgrade as you grow.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  isAnnual ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <Badge className="bg-green-100 text-green-800">Save up to 20%</Badge>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = getPrice(plan);
              const period = getPeriod(plan);
              const savings = getSavings(plan);
              
              return (
                <Card key={index} className={`relative ${plan.popular ? 'border-2 border-purple-500 shadow-lg' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                      plan.popular ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${price}</span>
                      <span className="text-gray-600">/{period}</span>
                      {isAnnual && plan.priceMonthly && (
                        <div className="text-sm text-gray-500 mt-1">
                          ${(price / 12).toFixed(2)}/month billed annually
                        </div>
                      )}
                      {savings && (
                        <div className="text-sm text-green-600 font-medium mt-1">
                          Save {savings}% annually
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link href={plan.name === 'Free' ? '/signup' : '/signup'}>
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                            : ''
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Feature Comparison</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Features</th>
                        <th className="text-center p-4 font-semibold">Free</th>
                        <th className="text-center p-4 font-semibold">Standard</th>
                        <th className="text-center p-4 font-semibold">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4">Subscription tracking</td>
                        <td className="text-center p-4">Up to 10</td>
                        <td className="text-center p-4">Unlimited</td>
                        <td className="text-center p-4">Unlimited</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4">Email notifications</td>
                        <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                        <td className="text-center p-4">Unlimited</td>
                        <td className="text-center p-4">Unlimited</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4">SMS/WhatsApp messages</td>
                        <td className="text-center p-4"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                        <td className="text-center p-4">50/month</td>
                        <td className="text-center p-4">300/month</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4">Analytics & insights</td>
                        <td className="text-center p-4">Basic</td>
                        <td className="text-center p-4">Advanced</td>
                        <td className="text-center p-4">Advanced</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4">Bank integration</td>
                        <td className="text-center p-4"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                        <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                        <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4">Export data (CSV/ICS)</td>
                        <td className="text-center p-4"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                        <td className="text-center p-4"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                        <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4">Calendar sync</td>
                        <td className="text-center p-4"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                        <td className="text-center p-4"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                        <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="p-4">Support</td>
                        <td className="text-center p-4">Community</td>
                        <td className="text-center p-4">Priority Email</td>
                        <td className="text-center p-4">Priority Support</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Communication Features */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Communication Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email Notifications</h3>
                  <p className="text-gray-600 text-sm">
                    Receive payment reminders and updates via email. Available on all plans.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">SMS Messages</h3>
                  <p className="text-gray-600 text-sm">
                    Get instant text message alerts for important payment reminders.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Smartphone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">WhatsApp Integration</h3>
                  <p className="text-gray-600 text-sm">
                    Receive notifications through WhatsApp for convenient mobile access.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">{faq.question}</h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Take Control?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Start your free trial today and see how Subie can help you save money and time.
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