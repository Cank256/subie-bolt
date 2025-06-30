import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Bell, Calendar, Clock, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Smart Reminders | Subie',
  description: 'Never miss a subscription renewal with our intelligent reminder system.'
}

export default function RemindersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/features" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Features
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Smart Reminders
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay ahead of your subscriptions with intelligent, customizable reminders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Renewal Alerts</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Get notified before your subscriptions renew so you can decide whether to continue or cancel.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Custom Timing</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Set reminders for 1, 3, 7, or 30 days before renewal. Choose what works best for you.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Smart Settings</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Automatically adjust reminder frequency based on subscription cost and your usage patterns.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Reminder Types</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Renewal Reminders</h3>
                <p className="text-gray-600">
                  Get notified before your subscriptions automatically renew. Perfect for monthly and annual subscriptions.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Price Change Alerts</h3>
                <p className="text-gray-600">
                  Be the first to know when subscription prices increase or decrease, so you can make informed decisions.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget Notifications</h3>
                <p className="text-gray-600">
                  Receive alerts when you're approaching your monthly subscription budget limits.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unused Service Alerts</h3>
                <p className="text-gray-600">
                  Get reminded about subscriptions you haven't used recently, helping you identify potential savings.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white">
              <h2 className="text-2xl font-semibold mb-4">Never Miss Another Renewal</h2>
              <p className="text-purple-100 mb-6">
                Join thousands of users who save money by staying informed about their subscriptions.
              </p>
              <Link 
                href="/signup" 
                className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}