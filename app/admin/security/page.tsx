'use client';

import { useState, useEffect } from 'react'
import { AdminGuard } from '@/components/ui/admin-guard'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Key, 
  Eye, 
  EyeOff,
  UserX,
  Clock,
  Globe,
  Smartphone,
  RefreshCw,
  Download,
  Settings,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface SecurityEvent {
  id: string
  type: 'login_attempt' | 'failed_login' | 'password_reset' | 'account_locked' | 'suspicious_activity' | 'data_breach'
  severity: 'low' | 'medium' | 'high' | 'critical'
  user_id?: string
  ip_address: string
  user_agent: string
  location?: string
  timestamp: string
  details: string
  status: 'active' | 'resolved' | 'investigating'
}

interface SecuritySettings {
  password_policy: {
    min_length: number
    require_uppercase: boolean
    require_lowercase: boolean
    require_numbers: boolean
    require_symbols: boolean
    max_age_days: number
  }
  session_settings: {
    max_duration_hours: number
    idle_timeout_minutes: number
    concurrent_sessions: number
  }
  login_security: {
    max_failed_attempts: number
    lockout_duration_minutes: number
    require_2fa: boolean
    allow_remember_device: boolean
  }
  ip_restrictions: {
    enabled: boolean
    whitelist: string[]
    blacklist: string[]
  }
}

interface ActiveSession {
  id: string
  user_id: string
  user_email: string
  ip_address: string
  user_agent: string
  location?: string
  created_at: string
  last_activity: string
  is_current: boolean
}

export default function AdminSecurityPage() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [settings, setSettings] = useState<SecuritySettings>({
    password_policy: {
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: false,
      max_age_days: 90
    },
    session_settings: {
      max_duration_hours: 24,
      idle_timeout_minutes: 30,
      concurrent_sessions: 3
    },
    login_security: {
      max_failed_attempts: 5,
      lockout_duration_minutes: 15,
      require_2fa: false,
      allow_remember_device: true
    },
    ip_restrictions: {
      enabled: false,
      whitelist: [],
      blacklist: []
    }
  })
  const [loading, setLoading] = useState(true)
  const [eventFilter, setEventFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState<string>('24h')

  useEffect(() => {
    fetchSecurityData()
  }, [eventFilter, severityFilter, timeFilter])

  const fetchSecurityData = async () => {
    try {
      setLoading(true)
      
      // Mock security events data
      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          type: 'failed_login',
          severity: 'medium',
          user_id: 'user123',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'New York, US',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          details: 'Multiple failed login attempts detected',
          status: 'active'
        },
        {
          id: '2',
          type: 'suspicious_activity',
          severity: 'high',
          user_id: 'user456',
          ip_address: '10.0.0.50',
          user_agent: 'curl/7.68.0',
          location: 'Unknown',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          details: 'Unusual API access pattern detected',
          status: 'investigating'
        },
        {
          id: '3',
          type: 'login_attempt',
          severity: 'low',
          user_id: 'user789',
          ip_address: '203.0.113.1',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
          location: 'London, UK',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          details: 'Login from new device',
          status: 'resolved'
        },
        {
          id: '4',
          type: 'account_locked',
          severity: 'medium',
          user_id: 'user101',
          ip_address: '198.51.100.1',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          location: 'Toronto, CA',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          details: 'Account locked due to multiple failed attempts',
          status: 'resolved'
        },
        {
          id: '5',
          type: 'password_reset',
          severity: 'low',
          user_id: 'user202',
          ip_address: '172.16.0.1',
          user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          location: 'Berlin, DE',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          details: 'Password reset requested',
          status: 'resolved'
        }
      ]
      
      // Mock active sessions data
      const mockSessions: ActiveSession[] = [
        {
          id: '1',
          user_id: 'user123',
          user_email: 'admin@example.com',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'New York, US',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          last_activity: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          is_current: true
        },
        {
          id: '2',
          user_id: 'user456',
          user_email: 'user@example.com',
          ip_address: '203.0.113.1',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
          location: 'London, UK',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          last_activity: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          is_current: false
        },
        {
          id: '3',
          user_id: 'user789',
          user_email: 'test@example.com',
          ip_address: '198.51.100.1',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          location: 'Toronto, CA',
          created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          last_activity: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
          is_current: false
        }
      ]
      
      // Apply filters
      let filteredEvents = mockEvents
      
      if (eventFilter !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.type === eventFilter)
      }
      
      if (severityFilter !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.severity === severityFilter)
      }
      
      // Apply time filter
      const now = Date.now()
      const timeFilters = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      }
      
      if (timeFilter !== 'all') {
        const timeLimit = timeFilters[timeFilter as keyof typeof timeFilters]
        filteredEvents = filteredEvents.filter(event => 
          now - new Date(event.timestamp).getTime() <= timeLimit
        )
      }
      
      setSecurityEvents(filteredEvents)
      setActiveSessions(mockSessions)
      
    } catch (error) {
      console.error('Error fetching security data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSettings = async () => {
    try {
      // In a real app, you would save settings to your backend
      console.log('Updating security settings:', settings)
      alert('Security settings updated successfully!')
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  const handleTerminateSession = async (sessionId: string) => {
    if (confirm('Are you sure you want to terminate this session?')) {
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId))
    }
  }

  const handleResolveEvent = async (eventId: string) => {
    setSecurityEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: 'resolved' as const }
        : event
    ))
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'destructive'
      case 'investigating': return 'default'
      case 'resolved': return 'secondary'
      default: return 'secondary'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'failed_login': return <XCircle className="w-4 h-4" />
      case 'login_attempt': return <Eye className="w-4 h-4" />
      case 'password_reset': return <Key className="w-4 h-4" />
      case 'account_locked': return <UserX className="w-4 h-4" />
      case 'suspicious_activity': return <AlertTriangle className="w-4 h-4" />
      case 'data_breach': return <Shield className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportSecurityReport = () => {
    const csvContent = [
      ['Timestamp', 'Type', 'Severity', 'User ID', 'IP Address', 'Location', 'Details', 'Status'],
      ...securityEvents.map(event => [
        event.timestamp,
        event.type,
        event.severity,
        event.user_id || '',
        event.ip_address,
        event.location || '',
        event.details,
        event.status
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stats = {
    total_events: securityEvents.length,
    critical_events: securityEvents.filter(e => e.severity === 'critical').length,
    active_events: securityEvents.filter(e => e.status === 'active').length,
    active_sessions: activeSessions.length
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
                  <Shield className="w-8 h-8 mr-3 text-purple-600" />
                  Security Center
                </h1>
                <p className="text-gray-600 mt-1">Monitor security events and manage security settings</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button onClick={fetchSecurityData} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={exportSecurityReport} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_events}</p>
                  </div>
                  <Shield className="w-6 h-6 text-gray-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical Events</p>
                    <p className="text-2xl font-bold text-red-600">{stats.critical_events}</p>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Threats</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.active_events}</p>
                  </div>
                  <XCircle className="w-6 h-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.active_sessions}</p>
                  </div>
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="events" className="space-y-6">
            <TabsList>
              <TabsTrigger value="events">Security Events</TabsTrigger>
              <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
              <TabsTrigger value="settings">Security Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Event Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Event Type</Label>
                      <Select value={eventFilter} onValueChange={setEventFilter}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="failed_login">Failed Login</SelectItem>
                          <SelectItem value="login_attempt">Login Attempt</SelectItem>
                          <SelectItem value="password_reset">Password Reset</SelectItem>
                          <SelectItem value="account_locked">Account Locked</SelectItem>
                          <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                          <SelectItem value="data_breach">Data Breach</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Severity</Label>
                      <Select value={severityFilter} onValueChange={setSeverityFilter}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severities</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Time Range</Label>
                      <Select value={timeFilter} onValueChange={setTimeFilter}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">Last Hour</SelectItem>
                          <SelectItem value="24h">Last 24 Hours</SelectItem>
                          <SelectItem value="7d">Last 7 Days</SelectItem>
                          <SelectItem value="30d">Last 30 Days</SelectItem>
                          <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Events Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Security Events ({securityEvents.length})</span>
                    {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {securityEvents.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-mono text-sm">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span>{formatDateTime(event.timestamp)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getEventIcon(event.type)}
                                <span className="capitalize">{event.type.replace('_', ' ')}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getSeverityBadgeVariant(event.severity)}>
                                {event.severity.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {event.user_id ? (
                                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                                  {event.user_id}
                                </code>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-sm">{event.ip_address}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Globe className="w-3 h-3 text-gray-400" />
                                <span>{event.location || 'Unknown'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={event.details}>
                                {event.details}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(event.status)}>
                                {event.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {event.status === 'active' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleResolveEvent(event.id)}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Resolve
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {securityEvents.length === 0 && (
                    <div className="text-center py-8">
                      <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No security events found</h3>
                      <p className="text-gray-600">Try adjusting your filter criteria</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active User Sessions</CardTitle>
                  <CardDescription>Monitor and manage active user sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Device</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Activity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeSessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{session.user_email}</div>
                                <div className="text-xs text-gray-500">{session.user_id}</div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{session.ip_address}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Smartphone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm truncate max-w-xs" title={session.user_agent}>
                                  {session.user_agent.split(' ')[0]}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Globe className="w-3 h-3 text-gray-400" />
                                <span>{session.location || 'Unknown'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDateTime(session.created_at)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDateTime(session.last_activity)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={session.is_current ? 'default' : 'secondary'}>
                                {session.is_current ? 'Current' : 'Active'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {!session.is_current && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleTerminateSession(session.id)}
                                >
                                  <UserX className="w-3 h-3 mr-1" />
                                  Terminate
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* Password Policy */}
              <Card>
                <CardHeader>
                  <CardTitle>Password Policy</CardTitle>
                  <CardDescription>Configure password requirements and policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min_length">Minimum Length</Label>
                      <Input
                        id="min_length"
                        type="number"
                        value={settings.password_policy.min_length}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          password_policy: {
                            ...prev.password_policy,
                            min_length: parseInt(e.target.value)
                          }
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="max_age">Maximum Age (days)</Label>
                      <Input
                        id="max_age"
                        type="number"
                        value={settings.password_policy.max_age_days}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          password_policy: {
                            ...prev.password_policy,
                            max_age_days: parseInt(e.target.value)
                          }
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.password_policy.require_uppercase}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          password_policy: {
                            ...prev.password_policy,
                            require_uppercase: checked
                          }
                        }))}
                      />
                      <Label>Require uppercase letters</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.password_policy.require_lowercase}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          password_policy: {
                            ...prev.password_policy,
                            require_lowercase: checked
                          }
                        }))}
                      />
                      <Label>Require lowercase letters</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.password_policy.require_numbers}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          password_policy: {
                            ...prev.password_policy,
                            require_numbers: checked
                          }
                        }))}
                      />
                      <Label>Require numbers</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.password_policy.require_symbols}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          password_policy: {
                            ...prev.password_policy,
                            require_symbols: checked
                          }
                        }))}
                      />
                      <Label>Require symbols</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Login Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Login Security</CardTitle>
                  <CardDescription>Configure login attempt limits and security measures</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="max_attempts">Max Failed Attempts</Label>
                      <Input
                        id="max_attempts"
                        type="number"
                        value={settings.login_security.max_failed_attempts}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          login_security: {
                            ...prev.login_security,
                            max_failed_attempts: parseInt(e.target.value)
                          }
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lockout_duration">Lockout Duration (minutes)</Label>
                      <Input
                        id="lockout_duration"
                        type="number"
                        value={settings.login_security.lockout_duration_minutes}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          login_security: {
                            ...prev.login_security,
                            lockout_duration_minutes: parseInt(e.target.value)
                          }
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.login_security.require_2fa}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          login_security: {
                            ...prev.login_security,
                            require_2fa: checked
                          }
                        }))}
                      />
                      <Label>Require Two-Factor Authentication</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.login_security.allow_remember_device}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          login_security: {
                            ...prev.login_security,
                            allow_remember_device: checked
                          }
                        }))}
                      />
                      <Label>Allow &quot;Remember this device&quot;</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Management</CardTitle>
                  <CardDescription>Configure session duration and limits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="max_duration">Max Duration (hours)</Label>
                      <Input
                        id="max_duration"
                        type="number"
                        value={settings.session_settings.max_duration_hours}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          session_settings: {
                            ...prev.session_settings,
                            max_duration_hours: parseInt(e.target.value)
                          }
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="idle_timeout">Idle Timeout (minutes)</Label>
                      <Input
                        id="idle_timeout"
                        type="number"
                        value={settings.session_settings.idle_timeout_minutes}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          session_settings: {
                            ...prev.session_settings,
                            idle_timeout_minutes: parseInt(e.target.value)
                          }
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="concurrent_sessions">Concurrent Sessions</Label>
                      <Input
                        id="concurrent_sessions"
                        type="number"
                        value={settings.session_settings.concurrent_sessions}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          session_settings: {
                            ...prev.session_settings,
                            concurrent_sessions: parseInt(e.target.value)
                          }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleUpdateSettings}>
                  <Settings className="w-4 h-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}