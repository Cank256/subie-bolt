'use client'

import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
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

export function Footer() {
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
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {settings.app_name}
            </h3>
            <p className="text-gray-300 text-sm">
              {settings.app_description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Features</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features/subscriptions" className="text-gray-300 hover:text-white transition-colors">
                  Subscription Management
                </Link>
              </li>
              <li>
                <Link href="/features/billing" className="text-gray-300 hover:text-white transition-colors">
                  Billing & Payments
                </Link>
              </li>
              <li>
                <Link href="/features/analytics" className="text-gray-300 hover:text-white transition-colors">
                  Analytics & Insights
                </Link>
              </li>
              <li>
                <Link href="/responsible-spending" className="text-gray-300 hover:text-white transition-colors">
                  Responsible Spending
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-300 hover:text-white transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-300 hover:text-white transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{settings.support_email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{settings.phone_contact}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-gray-300">
                  {settings.company_address.split(',').map((line, index) => (
                    <span key={index}>
                      {line.trim()}
                      {index < settings.company_address.split(',').length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-4 md:mb-0">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 Subie. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}