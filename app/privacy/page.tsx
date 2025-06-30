import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Shield, Eye, Lock, UserCheck } from 'lucide-react';

export default function PrivacyPage()  {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">
              Last updated: January 1, 2025
            </p>
          </div>

          {/* Privacy Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Lock className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Bank-Level Security</h3>
                <p className="text-gray-600 text-sm">
                  Your data is encrypted with the same standards used by financial institutions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Transparent Practices</h3>
                <p className="text-gray-600 text-sm">
                  We clearly explain what data we collect and how we use it
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <UserCheck className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Your Control</h3>
                <p className="text-gray-600 text-sm">
                  You can access, modify, or delete your data at any time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Policy Content */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
                  <p className="text-gray-700 mb-4">
                    When you create an account, we collect:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Name and email address</li>
                    <li>Phone number (if provided)</li>
                    <li>Profile picture (optional)</li>
                    <li>Account preferences and settings</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Financial Information</h3>
                  <p className="text-gray-700 mb-4">
                    To provide our subscription tracking services, we may collect:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Bank account and credit card information (through secure third-party providers)</li>
                    <li>Transaction data related to subscriptions</li>
                    <li>Subscription service details and payment amounts</li>
                  </ul>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Important:</strong> We never store your banking credentials directly. All financial connections are made through secure, encrypted third-party services like Plaid.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-700 mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Provide and maintain our subscription tracking service</li>
                    <li>Send payment reminders and notifications</li>
                    <li>Generate spending analytics and insights</li>
                    <li>Improve our service and develop new features</li>
                    <li>Communicate with you about your account and our service</li>
                    <li>Comply with legal obligations and prevent fraud</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                  <p className="text-gray-700 mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Providers</h3>
                  <p className="text-gray-700 mb-4">
                    We may share information with trusted third-party service providers who assist us in operating our service, such as:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Payment processors (Flutterwave, Stripe)</li>
                    <li>Financial data aggregators (Plaid)</li>
                    <li>Cloud hosting providers (AWS, Google Cloud)</li>
                    <li>Analytics and monitoring services</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Legal Requirements</h3>
                  <p className="text-gray-700 mb-4">
                    We may disclose your information when required by law or to protect our rights, property, or safety.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                  <p className="text-gray-700 mb-4">
                    We implement industry-standard security measures to protect your information:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>256-bit SSL encryption for all data transmission</li>
                    <li>AES-256 encryption for data at rest</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Multi-factor authentication options</li>
                    <li>Limited access controls for our team members</li>
                  </ul>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      <strong>Security Commitment:</strong> We maintain SOC 2 Type II compliance and follow OWASP security guidelines to protect your data.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h2>
                  <p className="text-gray-700 mb-4">
                    You have the following rights regarding your personal information:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Access and Portability</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Request a copy of your personal data</li>
                    <li>Export your subscription data in a portable format</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Correction and Deletion</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Update or correct your personal information</li>
                    <li>Request deletion of your account and associated data</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Communication Preferences</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Opt out of marketing communications</li>
                    <li>Customize notification settings</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
                  <p className="text-gray-700 mb-4">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Remember your login status and preferences</li>
                    <li>Analyze how you use our service</li>
                    <li>Improve our website performance</li>
                    <li>Provide personalized experiences</li>
                  </ul>
                  <p className="text-gray-700 mb-4">
                    You can control cookie settings through your browser preferences.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. International Data Transfers</h2>
                  <p className="text-gray-700 mb-4">
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Standard Contractual Clauses for EU data transfers</li>
                    <li>Adequacy decisions where applicable</li>
                    <li>Certification under privacy frameworks</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
                  <p className="text-gray-700 mb-4">
                    Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
                  <p className="text-gray-700 mb-4">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. For material changes, we will provide additional notice.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
                  <p className="text-gray-700 mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-gray-700 space-y-2">
                      <li>Email: privacy@subie.com</li>
                      <li>Data Protection Officer: dpo@subie.com</li>
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