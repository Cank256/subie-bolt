'use client';

import { useState, useEffect } from 'react'
import { AdminGuard } from '@/components/ui/admin-guard'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Bell, 
  Plus, 
  Send, 
  Edit, 
  Trash2, 
  Users, 
  Mail,
  MessageSquare,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Eye,
  Settings
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  target: 'all' | 'admins' | 'users' | 'specific'
  target_users?: string[]
  status: 'draft' | 'sent' | 'scheduled'
  created_at: string
  sent_at?: string
  scheduled_for?: string
  read_count: number
  total_recipients: number
  channels: ('email' | 'in_app' | 'push')[]
}

interface NotificationTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: 'info' | 'warning' | 'error' | 'success'
  channels: ('email' | 'in_app' | 'push')[]
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    target: 'all' as 'all' | 'admins' | 'users' | 'specific',
    target_users: '',
    channels: ['in_app'] as ('email' | 'in_app' | 'push')[],
    scheduled_for: ''
  })
  
  const [templateData, setTemplateData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'info' as const,
    channels: ['email'] as ('email' | 'in_app' | 'push')[]
  })

  useEffect(() => {
    fetchNotifications()
    fetchTemplates()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      
      // Mock data - in a real app, fetch from your notifications table
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'System Maintenance Scheduled',
          message: 'We will be performing scheduled maintenance on Sunday, 2AM-4AM EST. Some services may be temporarily unavailable.',
          type: 'warning',
          target: 'all',
          status: 'sent',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          sent_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          read_count: 145,
          total_recipients: 200,
          channels: ['email', 'in_app']
        },
        {
          id: '2',
          title: 'New Feature: Advanced Analytics',
          message: 'We\'re excited to announce our new advanced analytics dashboard with real-time insights and custom reports.',
          type: 'success',
          target: 'users',
          status: 'sent',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          sent_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
          read_count: 89,
          total_recipients: 150,
          channels: ['email', 'in_app', 'push']
        },
        {
          id: '3',
          title: 'Security Alert: Password Reset Required',
          message: 'As a security precaution, please reset your password within the next 7 days.',
          type: 'error',
          target: 'specific',
          target_users: ['user123', 'user456'],
          status: 'draft',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read_count: 0,
          total_recipients: 2,
          channels: ['email', 'in_app']
        },
        {
          id: '4',
          title: 'Welcome to Premium!',
          message: 'Thank you for upgrading to Premium. Enjoy unlimited access to all features.',
          type: 'info',
          target: 'users',
          status: 'scheduled',
          created_at: new Date().toISOString(),
          scheduled_for: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          read_count: 0,
          total_recipients: 25,
          channels: ['email', 'in_app']
        }
      ]
      
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      // Mock templates data
      const mockTemplates: NotificationTemplate[] = [
        {
          id: '1',
          name: 'Welcome Email',
          subject: 'Welcome to {{app_name}}!',
          content: 'Hi {{user_name}},\n\nWelcome to {{app_name}}! We\'re excited to have you on board.\n\nBest regards,\nThe Team',
          type: 'success',
          channels: ['email']
        },
        {
          id: '2',
          name: 'Password Reset',
          subject: 'Reset Your Password',
          content: 'Hi {{user_name}},\n\nClick the link below to reset your password:\n{{reset_link}}\n\nIf you didn\'t request this, please ignore this email.',
          type: 'info',
          channels: ['email']
        },
        {
          id: '3',
          name: 'Maintenance Alert',
          subject: 'Scheduled Maintenance Notice',
          content: 'We will be performing maintenance on {{date}} from {{start_time}} to {{end_time}}. Some services may be temporarily unavailable.',
          type: 'warning',
          channels: ['email', 'in_app']
        }
      ]
      
      setTemplates(mockTemplates)
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const handleCreateNotification = async () => {
    try {
      // In a real app, you would save to your notifications table
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: formData.title,
        message: formData.message,
        type: formData.type,
        target: formData.target,
        target_users: formData.target === 'specific' ? formData.target_users.split(',').map(u => u.trim()) : undefined,
        status: formData.scheduled_for ? 'scheduled' : 'draft',
        created_at: new Date().toISOString(),
        scheduled_for: formData.scheduled_for || undefined,
        read_count: 0,
        total_recipients: formData.target === 'all' ? 200 : formData.target === 'users' ? 150 : formData.target_users.split(',').length,
        channels: formData.channels
      }
      
      setNotifications(prev => [newNotification, ...prev])
      setShowCreateDialog(false)
      resetForm()
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  const handleSendNotification = async (id: string) => {
    try {
      // In a real app, you would trigger the notification sending process
      setNotifications(prev => prev.map(notif => 
        notif.id === id 
          ? { ...notif, status: 'sent' as const, sent_at: new Date().toISOString() }
          : notif
      ))
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  const handleDeleteNotification = async (id: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(notif => notif.id !== id))
    }
  }

  const handleCreateTemplate = async () => {
    try {
      const newTemplate: NotificationTemplate = {
        id: Date.now().toString(),
        name: templateData.name,
        subject: templateData.subject,
        content: templateData.content,
        type: templateData.type,
        channels: templateData.channels
      }
      
      setTemplates(prev => [newTemplate, ...prev])
      setShowTemplateDialog(false)
      resetTemplateForm()
    } catch (error) {
      console.error('Error creating template:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      target: 'all',
      target_users: '',
      channels: ['in_app'],
      scheduled_for: ''
    })
  }

  const resetTemplateForm = () => {
    setTemplateData({
      name: '',
      subject: '',
      content: '',
      type: 'info',
      channels: ['email']
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'success': return <CheckCircle className="w-4 h-4" />
      case 'info': return <Info className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'error': return 'destructive'
      case 'warning': return 'default'
      case 'success': return 'default'
      case 'info': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default'
      case 'draft': return 'secondary'
      case 'scheduled': return 'outline'
      default: return 'secondary'
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

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    draft: notifications.filter(n => n.status === 'draft').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length
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
                  <Bell className="w-8 h-8 mr-3 text-purple-600" />
                  Notifications
                </h1>
                <p className="text-gray-600 mt-1">Manage system notifications and user communications</p>
              </div>
              <div className="flex items-center space-x-3">
                <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Templates
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Notification
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Bell className="w-6 h-6 text-gray-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sent</p>
                    <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
                  </div>
                  <Send className="w-6 h-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Draft</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.draft}</p>
                  </div>
                  <Edit className="w-6 h-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Scheduled</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
                  </div>
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Notifications</CardTitle>
                  <CardDescription>Manage and monitor your notification campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Recipients</TableHead>
                          <TableHead>Read Rate</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {notifications.map((notification) => (
                          <TableRow key={notification.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{notification.title}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {notification.message}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getTypeBadgeVariant(notification.type)} className="flex items-center space-x-1 w-fit">
                                {getTypeIcon(notification.type)}
                                <span className="capitalize">{notification.type}</span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span className="capitalize">{notification.target}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(notification.status)}>
                                {notification.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{notification.total_recipients}</TableCell>
                            <TableCell>
                              {notification.status === 'sent' ? (
                                <div className="text-sm">
                                  {notification.read_count}/{notification.total_recipients}
                                  <div className="text-xs text-gray-500">
                                    {Math.round((notification.read_count / notification.total_recipients) * 100)}%
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDateTime(notification.created_at)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {notification.status === 'draft' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleSendNotification(notification.id)}
                                  >
                                    <Send className="w-3 h-3 mr-1" />
                                    Send
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedNotification(notification)}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteNotification(notification.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Notification Templates</span>
                    <Button onClick={() => setShowTemplateDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Template
                    </Button>
                  </CardTitle>
                  <CardDescription>Create reusable notification templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <Badge variant={getTypeBadgeVariant(template.type)}>
                              {template.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Subject:</p>
                              <p className="text-sm text-gray-600">{template.subject}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Channels:</p>
                              <div className="flex space-x-1 mt-1">
                                {template.channels.map((channel) => (
                                  <Badge key={channel} variant="outline" className="text-xs">
                                    {channel === 'email' && <Mail className="w-3 h-3 mr-1" />}
                                    {channel === 'in_app' && <Bell className="w-3 h-3 mr-1" />}
                                    {channel === 'push' && <MessageSquare className="w-3 h-3 mr-1" />}
                                    {channel}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Create Notification Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogDescription>
                  Send notifications to users via multiple channels
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Notification title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Notification message"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="target">Target Audience</Label>
                    <Select value={formData.target} onValueChange={(value: any) => setFormData(prev => ({ ...prev, target: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="users">Regular Users</SelectItem>
                        <SelectItem value="admins">Admins Only</SelectItem>
                        <SelectItem value="specific">Specific Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {formData.target === 'specific' && (
                  <div>
                    <Label htmlFor="target_users">User IDs (comma-separated)</Label>
                    <Input
                      id="target_users"
                      value={formData.target_users}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_users: e.target.value }))}
                      placeholder="user1, user2, user3"
                    />
                  </div>
                )}
                
                <div>
                  <Label>Channels</Label>
                  <div className="flex space-x-4 mt-2">
                    {(['email', 'in_app', 'push'] as const).map((channel) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Switch
                          checked={formData.channels.includes(channel)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({ ...prev, channels: [...prev.channels, channel] }))
                            } else {
                              setFormData(prev => ({ ...prev, channels: prev.channels.filter(c => c !== channel) }))
                            }
                          }}
                        />
                        <Label className="capitalize">{channel.replace('_', ' ')}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="scheduled_for">Schedule For (Optional)</Label>
                  <Input
                    id="scheduled_for"
                    type="datetime-local"
                    value={formData.scheduled_for}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_for: e.target.value }))}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNotification}>
                  {formData.scheduled_for ? 'Schedule' : 'Create'} Notification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create Template Dialog */}
          <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Notification Template</DialogTitle>
                <DialogDescription>
                  Create a reusable template for common notifications
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template_name">Template Name</Label>
                  <Input
                    id="template_name"
                    value={templateData.name}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Template name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="template_subject">Subject</Label>
                  <Input
                    id="template_subject"
                    value={templateData.subject}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Email subject (use {{variables}} for dynamic content)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="template_content">Content</Label>
                  <Textarea
                    id="template_content"
                    value={templateData.content}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Template content (use {{variables}} for dynamic content)"
                    rows={6}
                  />
                </div>
                
                <div>
                  <Label htmlFor="template_type">Type</Label>
                  <Select value={templateData.type} onValueChange={(value: any) => setTemplateData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Default Channels</Label>
                  <div className="flex space-x-4 mt-2">
                    {(['email', 'in_app', 'push'] as const).map((channel) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Switch
                          checked={templateData.channels.includes(channel)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTemplateData(prev => ({ ...prev, channels: [...prev.channels, channel] }))
                            } else {
                              setTemplateData(prev => ({ ...prev, channels: prev.channels.filter(c => c !== channel) }))
                            }
                          }}
                        />
                        <Label className="capitalize">{channel.replace('_', ' ')}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate}>
                  Create Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}