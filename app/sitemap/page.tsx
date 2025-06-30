import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { 
  Home, 
  User, 
  CreditCard, 
  HelpCircle, 
  Phone, 
  Shield,
  FileText,
  TrendingDown,
  Settings,
  Bell,
  BarChart3
} from 'lucide-react';

const sitemapSections = [
  {
    title: 'Main Pages',
    icon: Home,
    links: [
      { name: 'Home', href: '/', description: 'Landing page and overview' },
      { name: 'Login', href: '/login', description: 'Sign in to your account' },
      { name: 'Sign Up', href: '/signup', description: 'Create a new account' },
      { name: 'Subscriptions', href: '/subscriptions', description: 'Manage your subscriptions' },
      { name: 'Billing', href: '/billing', description: 'Payment history and methods' },
      { name: 'Profile', href: '/profile', description: 'Account settings and preferences' },
    ]
  },
  {
    title: 'Support & Help',
    icon: HelpCircle,
    links: [
      { name: 'Help Center', href: '/help', description: 'Documentation and guides' },
      { name: 'Contact Us', href: '/contact', description: 'Get in touch with support' },
      { name: 'Responsible Spending', href: '/responsible-spending', description: 'Financial wellness resources' },
    ]
  },
  {
    title: 'Legal & Policies',
    icon: Shield,
    links: [
      { name: 'Terms of Service', href: '/terms', description: 'Terms and conditions' },
      { name: 'Privacy Policy', href: '/privacy', description: 'How we protect your data' },
      { name: 'Sitemap', href: '/sitemap', description: 'Complete site navigation' },
    ]
  },
  {
    title: 'Account Features',
    icon: User,
    links: [
      { name: 'Notifications', href: '/notifications', description: 'Manage your alerts' },
      { name: 'Preferences', href: '/preferences', description: 'Customize your experience' },
      { name: 'Analytics', href: '/analytics', description: 'Spending insights and reports' },
    ]
  }
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sitemap</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete navigation guide to all pages and features available on Subie
            </p>
          </div>

          {/* Sitemap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sitemapSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon className="w-6 h-6 mr-3 text-purple-600" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {section.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className="block p-3 rounded-lg border hover:bg-purple-50 hover:border-purple-200 transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 group-hover:text-purple-600">
                              {link.name}
                            </h4>
                            <span className="text-gray-400 group-hover:text-purple-400">
                              →
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {link.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Resources */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">API Documentation</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Developer resources and API reference
                  </p>
                  <Link href="/api-docs" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                    View Documentation →
                  </Link>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">System Status</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Real-time service status and uptime
                  </p>
                  <Link href="/status" className="text-green-600 hover:text-green-500 text-sm font-medium">
                    Check Status →
                  </Link>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <TrendingDown className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Changelog</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Latest updates and feature releases
                  </p>
                  <Link href="/changelog" className="text-purple-600 hover:text-purple-500 text-sm font-medium">
                    View Updates →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Quick Navigation</h2>
            <p className="text-purple-100 mb-6">
              Jump to the most commonly accessed pages
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/subscriptions" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                Subscriptions
              </Link>
              <Link href="/billing" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                Billing
              </Link>
              <Link href="/help" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                Contact Support
              </Link>
              <Link href="/profile" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                Profile Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}