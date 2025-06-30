import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Shield, Lock, Eye, Server, Key, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Security & Trust</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your financial data deserves the highest level of protection. Learn how we keep your information secure with enterprise-grade security measures.
            </p>
          </div>

          {/* Security Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Lock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">256-bit Encryption</h3>
                <p className="text-gray-600 text-sm">
                  Bank-level SSL encryption protects all data in transit
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Server className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">SOC 2 Compliant</h3>
                <p className="text-gray-600 text-sm">
                  Independently audited security controls and processes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Key className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Zero Knowledge</h3>
                <p className="text-gray-600 text-sm">
                  We never store your banking credentials directly
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Eye className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">24/7 Monitoring</h3>
                <p className="text-gray-600 text-sm">
                  Continuous threat detection and response systems
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Security Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Data Protection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-green-600" />
                  Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Encryption Standards</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">AES-256 Encryption</p>
                        <p className="text-gray-600 text-sm">All sensitive data encrypted at rest using military-grade encryption</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">TLS 1.3 Protocol</p>
                        <p className="text-gray-600 text-sm">Latest transport layer security for all communications</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Key Management</p>
                        <p className="text-gray-600 text-sm">Hardware security modules (HSM) for encryption key protection</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Lock className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-800">Zero-Knowledge Architecture</h4>
                  </div>
                  <p className="text-green-700 text-sm">
                    We use read-only connections through Plaid and never store your banking passwords or credentials on our servers.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-6 h-6 mr-3 text-purple-600" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Authentication & Authorization</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Multi-Factor Authentication</p>
                        <p className="text-gray-600 text-sm">Optional 2FA with TOTP apps or SMS verification</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Role-Based Access</p>
                        <p className="text-gray-600 text-sm">Principle of least privilege for all system access</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Session Management</p>
                        <p className="text-gray-600 text-sm">Automatic logout and secure session handling</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 text-purple-600 mr-2" />
                    <h4 className="font-semibold text-purple-800">Advanced Protection</h4>
                  </div>
                  <p className="text-purple-700 text-sm">
                    Anomaly detection algorithms monitor for unusual account activity and automatically trigger security alerts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Infrastructure Security */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="w-6 h-6 mr-3 text-blue-600" />
                Infrastructure Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Cloud Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">AWS/GCP enterprise hosting</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">DDoS protection & WAF</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">Automated backups</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">Geographic redundancy</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Network Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">VPC isolation</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">Firewall protection</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">Intrusion detection</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">Traffic monitoring</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Application Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">OWASP compliance</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">Regular penetration testing</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">Code security scanning</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">Dependency monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance & Certifications */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3 text-orange-600" />
                Compliance & Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Industry Standards</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <h4 className="font-semibold">SOC 2 Type II</h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Annual third-party audits of our security controls and processes
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <h4 className="font-semibold">PCI DSS Level 1</h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Highest level of payment card industry data security standards
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <h4 className="font-semibold">ISO 27001</h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        International standard for information security management
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Privacy Regulations</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <h4 className="font-semibold">GDPR Compliant</h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Full compliance with European data protection regulations
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <h4 className="font-semibold">CCPA Compliant</h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        California Consumer Privacy Act compliance for US users
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <h4 className="font-semibold">PIPEDA Compliant</h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Personal Information Protection for Canadian users
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Best Practices */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Your Security Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-green-600">Recommended Actions</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Enable Two-Factor Authentication</p>
                        <p className="text-gray-600 text-sm">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Use a Strong Password</p>
                        <p className="text-gray-600 text-sm">Combine letters, numbers, and special characters</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Keep Your Email Secure</p>
                        <p className="text-gray-600 text-sm">Secure your email account used for Subie</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Review Account Activity</p>
                        <p className="text-gray-600 text-sm">Regularly check your account for unusual activity</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 text-orange-600">Security Warnings</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Never Share Your Password</p>
                        <p className="text-gray-600 text-sm">Subie will never ask for your password via email or phone</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Beware of Phishing</p>
                        <p className="text-gray-600 text-sm">Always verify emails claiming to be from Subie</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Use Secure Networks</p>
                        <p className="text-gray-600 text-sm">Avoid accessing your account on public Wi-Fi</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Log Out When Done</p>
                        <p className="text-gray-600 text-sm">Always log out on shared or public computers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Security Team */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-4">Security Questions or Concerns?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our security team is here to help. If you notice anything suspicious or have questions about our security practices, don't hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:security@subie.com" 
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Email Security Team
              </a>
              <a 
                href="/contact" 
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}