import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Smartphone, Download, Bell, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mobile App Features | Subie',
  description: 'Manage your subscriptions on the go with our mobile app features.'
}

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/features" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Features
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mobile App Features
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Take control of your subscriptions anywhere with our powerful mobile app
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-4">
                <Bell className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Smart Notifications</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get timely alerts about upcoming renewals, price changes, and spending limits.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Renewal reminders</li>
                <li>• Price change alerts</li>
                <li>• Budget notifications</li>
                <li>• Custom alert settings</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Secure Access</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Your data is protected with enterprise-grade security and biometric authentication.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Biometric login</li>
                <li>• End-to-end encryption</li>
                <li>• Secure data sync</li>
                <li>• Privacy controls</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Download Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              Our mobile app is currently in development. Sign up to be notified when it&apos;s available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium opacity-50 cursor-not-allowed">
                App Store (Coming Soon)
              </button>
              <button className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium opacity-50 cursor-not-allowed">
                Google Play (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}