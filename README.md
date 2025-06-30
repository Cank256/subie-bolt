# Subie - Subscription Management Platform

![Subie Logo](https://via.placeholder.com/200x80/8b5cf6/ffffff?text=Subie)

A modern, comprehensive subscription management platform built with Next.js, Supabase, and TypeScript. Subie helps users track, manage, and optimize their recurring subscriptions while providing powerful admin tools for platform management.

## 🚀 Features

### For Users
- **Subscription Tracking**: Monitor all your recurring subscriptions in one place
- **Analytics Dashboard**: Visualize spending patterns and subscription trends
- **Budget Management**: Set spending limits and receive notifications
- **Payment Tracking**: Track payment history and upcoming charges
- **Smart Notifications**: Get alerts for renewals, price changes, and budget limits
- **Multi-Currency Support**: Handle subscriptions in different currencies
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### For Administrators
- **User Management**: View, search, and manage user accounts with role-based access
- **Subscription Analytics**: Monitor platform-wide subscription metrics and revenue
- **Revenue Tracking**: Real-time revenue analytics with detailed breakdowns
- **System Insights**: Comprehensive dashboard with key performance indicators
- **Role-Based Access Control**: Secure admin, moderator, and user roles
- **Data Export**: Export analytics and reports for business intelligence

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Charts**: Recharts for data visualization
- **Authentication**: Supabase Auth with role-based access control
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Deployment**: Netlify (recommended)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd subie-bolt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**
   
   Apply the database migrations using one of these methods:
   
   **Option A: Supabase Dashboard (Recommended)**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migration files in order:
     - `supabase/migrations/20250629084806_humble_palace.sql`
     - `supabase/migrations/20250130000001_add_admin_role.sql`
   
   **Option B: Supabase CLI**
   ```bash
   npx supabase link --project-ref your-project-ref
   npx supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🔐 Admin Setup

The platform includes a comprehensive admin dashboard with the following features:

### Default Admin Account
- **Email**: `admin@subie.com`
- **Role**: `admin`

### Admin Features
- **Dashboard**: `/admin` - System overview and key metrics
- **User Management**: `/admin/users` - Manage users and roles
- **Subscriptions**: `/admin/subscriptions` - Monitor all subscriptions
- **Analytics**: `/admin/analytics` - Detailed system analytics

### Creating Additional Admins

**Via Database:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin@email.com';
```

**Via Admin Dashboard:**
1. Login as an existing admin
2. Navigate to User Management
3. Find the user and change their role to 'admin'

For detailed admin setup instructions, see [ADMIN_SETUP.md](./ADMIN_SETUP.md).

## 📁 Project Structure

```
subie-bolt/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   │   ├── analytics/     # Admin analytics
│   │   ├── subscriptions/ # Subscription management
│   │   └── users/         # User management
│   ├── auth/              # Authentication pages
│   ├── subscriptions/     # User subscription pages
│   └── ...               # Other app pages
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   └── supabase/         # Supabase client and utilities
├── scripts/              # Database and utility scripts
├── supabase/             # Supabase configuration
│   └── migrations/       # Database migrations
└── ...
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Role-Based Access Control**: Admin, moderator, and user roles
- **Protected Routes**: Authentication guards for sensitive pages
- **Secure Authentication**: Supabase Auth with email verification
- **Data Encryption**: All sensitive data encrypted at rest
- **HTTPS Only**: Secure communication in production

## 📊 Database Schema

### Core Tables
- **users**: User accounts with role-based access
- **subscriptions**: User subscription records
- **subscription_categories**: Service categories and metadata
- **transactions**: Payment and billing history
- **notifications**: User notification system
- **budgets**: User-defined spending limits
- **analytics_snapshots**: Historical analytics data
- **audit_logs**: System activity logging

### Key Features
- Row Level Security (RLS) policies
- Automatic timestamp management
- Foreign key constraints
- Optimized indexes for performance

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect your repository to Netlify**
   - Go to [Netlify](https://netlify.com) and sign in
   - Click "New site from Git" and connect your repository
   - Select the branch to deploy (usually `main`)

2. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18` (set in Environment variables)

3. **Set environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NODE_VERSION=18`

4. **Deploy**
   - Netlify will automatically build and deploy your site
   - Your site will be available at a generated URL

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Vercel
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Testing

### Test Scripts
- `scripts/test-db-connection.js` - Test database connectivity
- `scripts/test-login.js` - Test authentication flow
- `scripts/check-table-structure.js` - Verify database schema

### Running Tests
```bash
# Test database connection
node scripts/test-db-connection.js

# Test login functionality
node scripts/test-login.js
```

## 📈 Analytics & Monitoring

### Built-in Analytics
- User growth tracking
- Revenue analytics
- Subscription distribution
- Category performance metrics
- Real-time dashboard updates

### Admin Dashboard Features
- System overview with KPIs
- User management with search and filtering
- Subscription monitoring and management
- Revenue tracking and reporting
- Data visualization with charts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Admin Setup Guide](./ADMIN_SETUP.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### Common Issues

**Database Connection Issues**
- Verify Supabase credentials in `.env.local`
- Check if RLS policies are properly configured
- Ensure migrations have been applied

**Authentication Problems**
- Verify email verification is enabled in Supabase
- Check if user roles are properly assigned
- Clear browser cache and cookies

**Admin Access Issues**
- Ensure user has admin role in database
- Verify RLS policies allow admin access
- Check if admin routes are properly protected

### Getting Help

If you encounter issues:
1. Check the troubleshooting section in [ADMIN_SETUP.md](./ADMIN_SETUP.md)
2. Review the database schema and migrations
3. Check browser console for error messages
4. Verify environment variables are correctly set

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with popular subscription services
- [ ] Automated subscription optimization suggestions
- [ ] Multi-tenant support for businesses
- [ ] API for third-party integrations
- [ ] Advanced notification system
- [ ] Subscription sharing and family plans

---

**Built with ❤️ using Bolt.new, Next.js and Supabase**

For more information about the admin dashboard implementation, see [ADMIN_SETUP.md](./ADMIN_SETUP.md).