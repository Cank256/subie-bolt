'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { PhoneInput } from '@/components/ui/phone-input';
import { Mail, Phone, MapPin, Clock, MessageCircle, HeadphonesIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface GeneralSettings {
  app_name: string
  app_description: string
  support_email: string
  phone_contact: string
  company_name: string
  company_address: string
}

export default function ContactPage() {
  const [settings, setSettings] = useState<GeneralSettings>({
    app_name: 'Subie',
    app_description: 'Take control of your subscriptions with intelligent tracking, smart reminders, and powerful analytics.',
    support_email: 'support@subie.com',
    phone_contact: '+1 (555) 123-SUBI',
    company_name: 'Subie Inc.',
    company_address: '123 Tech Street, San Francisco, CA 94105'
  })
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.rpc('get_app_settings')
        if (error) throw error
        
        if (data && data.length > 0) {
          const settingsMap = data.reduce((acc: any, item: any) => {
            acc[item.setting_key] = item.setting_value
            return acc
          }, {})
          
          if (settingsMap.general) {
            setSettings(settingsMap.general)
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    
    fetchSettings()
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about Subie? We&apos;re here to help. Reach out to our support team anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Email Us</h4>
                      <p className="text-sm text-gray-600">{settings.support_email}</p>
                      <p className="text-sm text-gray-600">We&apos;ll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Call Us</h4>
                      <p className="text-sm text-gray-600">{settings.phone_contact}</p>
                      <p className="text-sm text-gray-600">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Live Chat</h4>
                      <p className="text-sm text-gray-600">Available 24/7</p>
                      <Button size="sm" className="mt-2" variant="outline">
                        Start Chat
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Office</h4>
                      <p className="text-sm text-gray-600">
                        {settings.company_address.split(',').map((line, index) => (
                          <span key={index}>
                            {line.trim()}
                            {index < settings.company_address.split(',').length - 1 && <br />}
                          </span>
                        ))}
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-4">
                    * Live chat and email support available 24/7
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <p className="text-gray-600">
                    Fill out the form below and we&apos;ll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number (optional)</Label>
                    <PhoneInput
                      id="phone"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your question or concern..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
                <p className="text-center text-gray-600">
                  Quick answers to common questions about Subie
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">How do I add a subscription?</h4>
                      <p className="text-sm text-gray-600">
                        Click the &quot;Add Subscription&quot; button on your dashboard and enter the service details, including name, cost, and billing frequency.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Can I import my existing subscriptions?</h4>
                      <p className="text-sm text-gray-600">
                        Yes! You can connect your bank accounts or credit cards to automatically import and track your subscription payments.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Is my financial data secure?</h4>
                      <p className="text-sm text-gray-600">
                        Absolutely. We use bank-level encryption and security measures to protect your data. We never store your banking credentials.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">How do payment reminders work?</h4>
                      <p className="text-sm text-gray-600">
                        Set up custom reminders for each subscription. Get notified via email, SMS, or push notifications before payments are due.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
                      <p className="text-sm text-gray-600">
                        Yes, you can cancel your Subie subscription at any time. Your data will remain accessible until the end of your billing period.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Do you offer a mobile app?</h4>
                      <p className="text-sm text-gray-600">
                        Yes! Our mobile apps for iOS and Android offer full functionality to manage your subscriptions on the go.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <p className="text-gray-600 mb-4">Still have questions?</p>
                  <Button variant="outline" asChild>
                    <a href="/help">
                      <HeadphonesIcon className="w-4 h-4 mr-2" />
                      Visit Help Center
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}