# Admin Dashboard Setup Guide

This guide explains how to set up and use the admin dashboard functionality that has been implemented for the Subie application.

## Overview

The admin dashboard provides comprehensive management capabilities for:
- User management and role assignment
- Subscription monitoring and management
- System analytics and insights
- Revenue tracking and reporting

## Database Changes

### New Migration File
A new migration file has been created: `supabase/migrations/20250130000001_add_admin_role.sql`

This migration adds:
- `role` field to the `users` table (user, admin, moderator)
- Admin role assignment for `admin@subie.com`
- Row Level Security (RLS) policies for admin access
- Helper functions: `is_admin()` and `get_admin_stats()`

### Applying the Migration

To apply the database changes, you have several options:

#### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250130000001_add_admin_role.sql`
4. Execute the SQL

#### Option 2: Supabase CLI (if configured)
```bash
# If you have Supabase CLI linked to your project
npx supabase db push
```

#### Option 3: Manual SQL Execution
Execute the SQL commands from the migration file directly in your database.

## Code Changes

### 1. Type Definitions (`lib/supabase/types.ts`)
- Added `role` field to user types
- Supports 'user', 'admin', 'moderator' roles

### 2. Authentication Hook (`hooks/use-auth.ts`)
- Added role-based properties: `isAdmin`, `isModerator`, `hasAdminAccess`
- Enhanced user object with role information

### 3. Authentication Service (`lib/supabase/auth.ts`)
- Updated `signIn` method to fetch user role
- Role information included in session data

### 4. Admin Guard Component (`components/ui/admin-guard.tsx`)
- Protects admin routes from unauthorized access
- Redirects non-admin users to appropriate pages

### 5. Admin Pages
Created comprehensive admin dashboard with:

#### Main Dashboard (`app/admin/page.tsx`)
- System overview and statistics
- Quick action links
- Admin-only access

#### User Management (`app/admin/users/page.tsx`)
- View all users
- Search and filter capabilities
- Role assignment functionality
- User status management

#### Subscription Management (`app/admin/subscriptions/page.tsx`)
- Monitor all subscriptions
- Revenue tracking
- Status management (active, paused, cancelled)
- Category-based filtering

#### Analytics Dashboard (`app/admin/analytics/page.tsx`)
- User growth charts
- Revenue analytics
- Subscription distribution
- Performance metrics

## Admin User Setup

### Default Admin Account
The migration automatically sets up:
- **Email**: `admin@subie.com`
- **Role**: `admin`

### Creating Additional Admin Users

1. **Via Database**:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-admin@email.com';
   ```

2. **Via Admin Dashboard**:
   - Login as an existing admin
   - Go to User Management
   - Find the user and change their role to 'admin'

## Accessing the Admin Dashboard

1. **Login** with an admin account (e.g., `admin@subie.com`)
2. **Navigate** to `/admin` or use the admin links in the navigation
3. **Explore** the different admin sections:
   - `/admin` - Main dashboard
   - `/admin/users` - User management
   - `/admin/subscriptions` - Subscription management
   - `/admin/analytics` - Analytics and insights

## Security Features

### Row Level Security (RLS)
- Admin users have full access to all tables
- Regular users can only access their own data
- Policies automatically enforce access control

### Route Protection
- All admin routes are protected by `AdminGuard`
- Unauthorized users are redirected
- Role-based access control throughout the application

### Database Functions
- `is_admin()` - Checks if current user is admin
- `get_admin_stats()` - Returns system statistics (admin-only)

## Features

### User Management
- ✅ View all users with pagination
- ✅ Search users by email/name
- ✅ Filter by role
- ✅ Change user roles
- ✅ View user details and status

### Subscription Management
- ✅ Monitor all subscriptions
- ✅ Track revenue by category
- ✅ Manage subscription status
- ✅ Filter by status and category
- ✅ Revenue analytics

### Analytics
- ✅ User growth tracking
- ✅ Revenue growth charts
- ✅ Subscription distribution
- ✅ Category performance
- ✅ Real-time statistics

### Dashboard Overview
- ✅ Key metrics display
- ✅ Quick action buttons
- ✅ System health indicators
- ✅ Recent activity summaries

## Troubleshooting

### Migration Issues
If you encounter issues with the migration:
1. Check your database connection
2. Ensure you have admin privileges
3. Verify the SQL syntax in your database version
4. Check for existing conflicting columns

### Access Issues
If admin dashboard is not accessible:
1. Verify the user has admin role in database
2. Check authentication is working
3. Ensure RLS policies are applied
4. Clear browser cache and cookies

### Development Server
The application is running on: `http://localhost:3001`

## Next Steps

1. **Apply the database migration**
2. **Test admin login** with `admin@subie.com`
3. **Explore admin features** in the dashboard
4. **Create additional admin users** as needed
5. **Customize admin features** based on your requirements

## Support

If you need help with the admin dashboard setup or encounter any issues, please refer to:
- Supabase documentation for RLS and migrations
- Next.js documentation for routing and components
- This README for specific implementation details

The admin dashboard is now fully functional and ready for use!