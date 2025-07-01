'use client';

import { useState, useEffect } from 'react'
import { AdminGuard } from '@/components/ui/admin-guard'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Save, 
  Upload, 
  Download, 
  Mail, 
  Globe,
  Palette,
  Database,
  Bell,
  Shield,
  Users,
  CreditCard,
  FileText,
  Info,
  CheckCircle,
  AlertTriangle,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface AppSettings {
  general: {
    app_name: string
    app_description: string
    app_url: string
    support_email: string
    company_name: string
    company_address: string
    timezone: string
    language: string
    currency: string
  }
  email: {
    smtp_host: string
    smtp_port: number
    smtp_username: string
    smtp_password: string
    smtp_encryption: string
    from_email: string
    from_name: string
  }
  notifications: {
    email_notifications: boolean
    push_notifications: boolean
    sms_notifications: boolean
    admin_alerts: boolean
    user_welcome_email: boolean
    subscription_reminders: boolean
  }
  features: {
    user_registration: boolean
    email_verification: boolean
    password_reset: boolean
    social_login: boolean
    two_factor_auth: boolean
    api_access: boolean
    analytics_tracking: boolean
  }
  billing: {
    stripe_publishable_key: string
    stripe_secret_key: string
    webhook_endpoint: string
    tax_rate: number
    currency: string
    trial_period_days: number
  }
  maintenance: {
    maintenance_mode: boolean
    maintenance_message: string
    allowed_ips: string[]
  }
}

interface SystemInfo {
  version: string
  environment: string
  database_status: string
  cache_status: string
  storage_used: string
  uptime: string
  last_backup: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    general: {
      app_name: 'Subie',
      app_description: 'Subscription management platform',
      app_url: 'https://subie.app',
      support_email: 'support@subie.app',
      company_name: 'Subie Inc.',
      company_address: '123 Main St, San Francisco, CA 94105',
      timezone: 'America/New_York',
      language: 'en',
      currency: 'USD'
    },
    email: {
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_username: '',
      smtp_password: '',
      smtp_encryption: 'tls',
      from_email: 'noreply@subie.app',
      from_name: 'Subie'
    },
    notifications: {
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      admin_alerts: true,
      user_welcome_email: true,
      subscription_reminders: true
    },
    features: {
      user_registration: true,
      email_verification: true,
      password_reset: true,
      social_login: false,
      two_factor_auth: false,
      api_access: true,
      analytics_tracking: true
    },
    billing: {
      stripe_publishable_key: '',
      stripe_secret_key: '',
      webhook_endpoint: '',
      tax_rate: 0.08,
      currency: 'USD',
      trial_period_days: 14
    },
    maintenance: {
      maintenance_mode: false,
      maintenance_message: 'We are currently performing scheduled maintenance. Please check back soon.',
      allowed_ips: []
    }
  })
  
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    version: '1.0.0',
    environment: 'production',
    database_status: 'healthy',
    cache_status: 'healthy',
    storage_used: '2.3 GB',
    uptime: '15 days, 3 hours',
    last_backup: '2024-01-15 02:00:00'
  })
  
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetchSettings()
    fetchSystemInfo()
  }, [])

  const fetchSettings = async () => {
    try {
      // In a real app, fetch settings from your backend
      // For now, we'll use the default settings
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const fetchSystemInfo = async () => {
    try {
      // In a real app, fetch system info from your backend
      // For now, we'll use mock data
    } catch (error) {
      console.error('Error fetching system info:', error)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaveStatus('saving')
      setLoading(true)
      
      // In a real app, you would save settings to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleTestEmail = async () => {
    try {
      // In a real app, you would send a test email
      alert('Test email sent successfully!')
    } catch (error) {
      console.error('Error sending test email:', error)
      alert('Failed to send test email')
    }
  }

  const handleBackupDatabase = async () => {
    try {
      // In a real app, you would trigger a database backup
      alert('Database backup initiated successfully!')
    } catch (error) {
      console.error('Error backing up database:', error)
      alert('Failed to backup database')
    }
  }

  const handleClearCache = async () => {
    try {
      // In a real app, you would clear the application cache
      alert('Cache cleared successfully!')
    } catch (error) {
      console.error('Error clearing cache:', error)
      alert('Failed to clear cache')
    }
  }

  const updateGeneralSettings = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value
      }
    }))
  }

  const updateEmailSettings = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [field]: value
      }
    }))
  }

  const updateNotificationSettings = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }

  const updateFeatureSettings = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [field]: value
      }
    }))
  }

  const updateBillingSettings = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      billing: {
        ...prev.billing,
        [field]: value
      }
    }))
  }

  const updateMaintenanceSettings = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      maintenance: {
        ...prev.maintenance,
        [field]: value
      }
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Healthy</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Warning</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <AdminGuard requireAdmin={true}>
      <AdminLayout>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Settings className="w-8 h-8 mr-3 text-purple-600" />
                  System Settings
                </h1>
                <p className="text-gray-600 mt-1">Configure application settings and system preferences</p>
              </div>
              <div className="flex items-center space-x-3">
                {saveStatus === 'saved' && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Settings saved</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center text-red-600">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Save failed</span>
                  </div>
                )}
                <Button 
                  onClick={handleSaveSettings} 
                  disabled={loading}
                  className="flex items-center"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic application configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="app_name">Application Name</Label>
                      <Input
                        id="app_name"
                        value={settings.general.app_name}
                        onChange={(e) => updateGeneralSettings('app_name', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="app_url">Application URL</Label>
                      <Input
                        id="app_url"
                        value={settings.general.app_url}
                        onChange={(e) => updateGeneralSettings('app_url', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="app_description">Description</Label>
                    <Textarea
                      id="app_description"
                      value={settings.general.app_description}
                      onChange={(e) => updateGeneralSettings('app_description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="support_email">Support Email</Label>
                      <Input
                        id="support_email"
                        type="email"
                        value={settings.general.support_email}
                        onChange={(e) => updateGeneralSettings('support_email', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        value={settings.general.company_name}
                        onChange={(e) => updateGeneralSettings('company_name', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="company_address">Company Address</Label>
                    <Textarea
                      id="company_address"
                      value={settings.general.company_address}
                      onChange={(e) => updateGeneralSettings('company_address', e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={settings.general.timezone} onValueChange={(value) => updateGeneralSettings('timezone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select value={settings.general.language} onValueChange={(value) => updateGeneralSettings('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={settings.general.currency} onValueChange={(value) => updateGeneralSettings('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="CAD">CAD (C$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                  <CardDescription>SMTP settings for sending emails</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtp_host">SMTP Host</Label>
                      <Input
                        id="smtp_host"
                        value={settings.email.smtp_host}
                        onChange={(e) => updateEmailSettings('smtp_host', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="smtp_port">SMTP Port</Label>
                      <Input
                        id="smtp_port"
                        type="number"
                        value={settings.email.smtp_port}
                        onChange={(e) => updateEmailSettings('smtp_port', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtp_username">SMTP Username</Label>
                      <Input
                        id="smtp_username"
                        value={settings.email.smtp_username}
                        onChange={(e) => updateEmailSettings('smtp_username', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="smtp_password">SMTP Password</Label>
                      <Input
                        id="smtp_password"
                        type="password"
                        value={settings.email.smtp_password}
                        onChange={(e) => updateEmailSettings('smtp_password', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="smtp_encryption">Encryption</Label>
                      <Select value={settings.email.smtp_encryption} onValueChange={(value) => updateEmailSettings('smtp_encryption', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="tls">TLS</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="from_email">From Email</Label>
                      <Input
                        id="from_email"
                        type="email"
                        value={settings.email.from_email}
                        onChange={(e) => updateEmailSettings('from_email', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="from_name">From Name</Label>
                      <Input
                        id="from_name"
                        value={settings.email.from_name}
                        onChange={(e) => updateEmailSettings('from_name', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleTestEmail} variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Test Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.email_notifications}
                        onCheckedChange={(checked) => updateNotificationSettings('email_notifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-gray-600">Send browser push notifications</p>
                      </div>
                      <Switch
                        checked={settings.notifications.push_notifications}
                        onCheckedChange={(checked) => updateNotificationSettings('push_notifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications via SMS</p>
                      </div>
                      <Switch
                        checked={settings.notifications.sms_notifications}
                        onCheckedChange={(checked) => updateNotificationSettings('sms_notifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Admin Alerts</Label>
                        <p className="text-sm text-gray-600">Send alerts to administrators</p>
                      </div>
                      <Switch
                        checked={settings.notifications.admin_alerts}
                        onCheckedChange={(checked) => updateNotificationSettings('admin_alerts', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Welcome Emails</Label>
                        <p className="text-sm text-gray-600">Send welcome emails to new users</p>
                      </div>
                      <Switch
                        checked={settings.notifications.user_welcome_email}
                        onCheckedChange={(checked) => updateNotificationSettings('user_welcome_email', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Subscription Reminders</Label>
                        <p className="text-sm text-gray-600">Send subscription renewal reminders</p>
                      </div>
                      <Switch
                        checked={settings.notifications.subscription_reminders}
                        onCheckedChange={(checked) => updateNotificationSettings('subscription_reminders', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Toggles</CardTitle>
                  <CardDescription>Enable or disable application features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>User Registration</Label>
                        <p className="text-sm text-gray-600">Allow new users to register</p>
                      </div>
                      <Switch
                        checked={settings.features.user_registration}
                        onCheckedChange={(checked) => updateFeatureSettings('user_registration', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Verification</Label>
                        <p className="text-sm text-gray-600">Require email verification for new accounts</p>
                      </div>
                      <Switch
                        checked={settings.features.email_verification}
                        onCheckedChange={(checked) => updateFeatureSettings('email_verification', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Password Reset</Label>
                        <p className="text-sm text-gray-600">Allow users to reset their passwords</p>
                      </div>
                      <Switch
                        checked={settings.features.password_reset}
                        onCheckedChange={(checked) => updateFeatureSettings('password_reset', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Social Login</Label>
                        <p className="text-sm text-gray-600">Enable login with social providers</p>
                      </div>
                      <Switch
                        checked={settings.features.social_login}
                        onCheckedChange={(checked) => updateFeatureSettings('social_login', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">Enable 2FA for enhanced security</p>
                      </div>
                      <Switch
                        checked={settings.features.two_factor_auth}
                        onCheckedChange={(checked) => updateFeatureSettings('two_factor_auth', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>API Access</Label>
                        <p className="text-sm text-gray-600">Allow API access for integrations</p>
                      </div>
                      <Switch
                        checked={settings.features.api_access}
                        onCheckedChange={(checked) => updateFeatureSettings('api_access', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Analytics Tracking</Label>
                        <p className="text-sm text-gray-600">Enable user analytics and tracking</p>
                      </div>
                      <Switch
                        checked={settings.features.analytics_tracking}
                        onCheckedChange={(checked) => updateFeatureSettings('analytics_tracking', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Configuration</CardTitle>
                  <CardDescription>Configure payment processing settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Keep your API keys secure. Never share them publicly or commit them to version control.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stripe_publishable_key">Stripe Publishable Key</Label>
                      <Input
                        id="stripe_publishable_key"
                        value={settings.billing.stripe_publishable_key}
                        onChange={(e) => updateBillingSettings('stripe_publishable_key', e.target.value)}
                        placeholder="pk_..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="stripe_secret_key">Stripe Secret Key</Label>
                      <Input
                        id="stripe_secret_key"
                        type="password"
                        value={settings.billing.stripe_secret_key}
                        onChange={(e) => updateBillingSettings('stripe_secret_key', e.target.value)}
                        placeholder="sk_..."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="webhook_endpoint">Webhook Endpoint</Label>
                    <Input
                      id="webhook_endpoint"
                      value={settings.billing.webhook_endpoint}
                      onChange={(e) => updateBillingSettings('webhook_endpoint', e.target.value)}
                      placeholder="https://your-app.com/api/webhooks/stripe"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                      <Input
                        id="tax_rate"
                        type="number"
                        step="0.01"
                        value={settings.billing.tax_rate}
                        onChange={(e) => updateBillingSettings('tax_rate', parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="billing_currency">Currency</Label>
                      <Select value={settings.billing.currency} onValueChange={(value) => updateBillingSettings('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="CAD">CAD (C$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="trial_period">Trial Period (days)</Label>
                      <Input
                        id="trial_period"
                        type="number"
                        value={settings.billing.trial_period_days}
                        onChange={(e) => updateBillingSettings('trial_period_days', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Mode</CardTitle>
                  <CardDescription>Configure maintenance mode settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-gray-600">Enable maintenance mode to restrict access</p>
                    </div>
                    <Switch
                      checked={settings.maintenance.maintenance_mode}
                      onCheckedChange={(checked) => updateMaintenanceSettings('maintenance_mode', checked)}
                    />
                  </div>
                  
                  {settings.maintenance.maintenance_mode && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Maintenance mode is currently enabled. Only administrators can access the application.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div>
                    <Label htmlFor="maintenance_message">Maintenance Message</Label>
                    <Textarea
                      id="maintenance_message"
                      value={settings.maintenance.maintenance_message}
                      onChange={(e) => updateMaintenanceSettings('maintenance_message', e.target.value)}
                      rows={3}
                      placeholder="Message to display to users during maintenance"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="allowed_ips">Allowed IP Addresses</Label>
                    <Input
                      id="allowed_ips"
                      value={settings.maintenance.allowed_ips.join(', ')}
                      onChange={(e) => updateMaintenanceSettings('allowed_ips', e.target.value.split(',').map(ip => ip.trim()).filter(ip => ip))}
                      placeholder="192.168.1.1, 10.0.0.1"
                    />
                    <p className="text-sm text-gray-600 mt-1">Comma-separated list of IP addresses that can access the app during maintenance</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>View system status and perform maintenance tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Version:</span>
                        <Badge variant="outline">{systemInfo.version}</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Environment:</span>
                        <Badge variant={systemInfo.environment === 'production' ? 'default' : 'secondary'}>
                          {systemInfo.environment}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Database:</span>
                        {getStatusBadge(systemInfo.database_status)}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Cache:</span>
                        {getStatusBadge(systemInfo.cache_status)}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Storage Used:</span>
                        <span className="text-sm">{systemInfo.storage_used}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Uptime:</span>
                        <span className="text-sm">{systemInfo.uptime}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Last Backup:</span>
                        <span className="text-sm">{systemInfo.last_backup}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-lg font-medium mb-4">System Actions</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={handleBackupDatabase} variant="outline">
                        <Database className="w-4 h-4 mr-2" />
                        Backup Database
                      </Button>
                      
                      <Button onClick={handleClearCache} variant="outline">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Cache
                      </Button>
                      
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Logs
                      </Button>
                      
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Restart Services
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}