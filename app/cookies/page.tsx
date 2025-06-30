import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Cookie, Settings, Eye, Shield } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Cookie className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-gray-600">
              Last updated: January 1, 2025
            </p>
          </div>

          {/* Cookie Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Settings className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Essential Cookies</h3>
                <p className="text-gray-600 text-sm">
                  Required for the website to function properly
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                <p className="text-gray-600 text-sm">
                  Help us understand how you use our website
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Preference Cookies</h3>
                <p className="text-gray-600 text-sm">
                  Remember your settings and preferences
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cookie Policy Content */}
          <Card>
            <CardHeader>
              <CardTitle>Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
                  <p className="text-gray-700 mb-4">
                    Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
                  <p className="text-gray-700 mb-4">
                    We use cookies for several purposes:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Essential Cookies</h3>
                  <p className="text-gray-700 mb-4">
                    These cookies are necessary for the website to function and cannot be switched off. They include:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Authentication cookies to keep you logged in</li>
                    <li>Security cookies to protect against fraud</li>
                    <li>Session cookies to maintain your preferences during your visit</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Analytics Cookies</h3>
                  <p className="text-gray-700 mb-4">
                    These cookies help us understand how visitors interact with our website:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Google Analytics to track website usage</li>
                    <li>Performance monitoring to identify issues</li>
                    <li>User behavior analysis to improve our service</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Preference Cookies</h3>
                  <p className="text-gray-700 mb-4">
                    These cookies remember your choices and preferences:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Language and region settings</li>
                    <li>Theme preferences (light/dark mode)</li>
                    <li>Notification settings</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
                  <p className="text-gray-700 mb-4">
                    You have several options for managing cookies:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Browser Settings</h3>
                  <p className="text-gray-700 mb-4">
                    Most web browsers allow you to control cookies through their settings:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete cookies when you close your browser</li>
                    <li>Receive notifications when cookies are set</li>
                  </ul>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Note:</strong> Blocking essential cookies may prevent some features of our website from working properly.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
                  <p className="text-gray-700 mb-4">
                    We may use third-party services that set their own cookies:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                    <li><strong>Social Media Platforms:</strong> For social login functionality</li>
                    <li><strong>Payment Processors:</strong> For secure payment processing</li>
                  </ul>
                  <p className="text-gray-700 mb-4">
                    These third parties have their own privacy policies and cookie practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Retention</h2>
                  <p className="text-gray-700 mb-4">
                    Different cookies have different lifespans:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                    <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
                    <li><strong>Authentication Cookies:</strong> Typically expire after 30 days of inactivity</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
                  <p className="text-gray-700 mb-4">
                    We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                  <p className="text-gray-700 mb-4">
                    If you have any questions about our use of cookies, please contact us:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-gray-700 space-y-2">
                      <li>Email: privacy@subie.com</li>
                      <li>Address: 123 Tech Street, San Francisco, CA 94105</li>
                      <li>Phone: +1 (555) 123-SUBI</li>
                    </ul>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}