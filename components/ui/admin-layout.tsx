'use client';

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  Database,
  FileText,
  Bell,
  Menu,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface AdminLayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and key metrics'
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
    description: 'Manage user accounts and roles'
  },
  {
    title: 'Subscriptions',
    href: '/admin/subscriptions',
    icon: CreditCard,
    description: 'Monitor and manage subscriptions'
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'System insights and reports'
  },
  {
    title: 'Database',
    href: '/admin/database',
    icon: Database,
    description: 'Database management and queries'
  },
  {
    title: 'System Logs',
    href: '/admin/logs',
    icon: FileText,
    description: 'View system logs and errors'
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
    description: 'Manage system notifications'
  },
  {
    title: 'Security',
    href: '/admin/security',
    icon: Shield,
    description: 'Security settings and monitoring'
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System configuration'
  }
]

function SidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white font-bold">
            S
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold">Subie Admin</h2>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100',
                    isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-gray-900'
                  )}
                >
                  <item.icon className={cn('h-5 w-5', isActive ? 'text-purple-700' : 'text-gray-500')} />
                  {!collapsed && (
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="space-y-2">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Home className="h-4 w-4 mr-2" />
              {!collapsed && 'Back to Site'}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            size="sm"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!collapsed && 'Sign Out'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className={cn(
        'hidden lg:flex lg:flex-col lg:border-r lg:bg-white transition-all duration-300',
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-80'
      )}>
        <SidebarContent collapsed={sidebarCollapsed} />
        
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 -right-3 z-10 h-6 w-6 rounded-full border bg-white shadow-md"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}