# Netlify Deployment Guide

This guide helps you deploy your Subie application to Netlify successfully.

## Required Environment Variables

Before deploying to Netlify, you must configure the following environment variables in your Netlify site settings:

### Essential Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://your-project-id.supabase.co`
   - Found in: Supabase Dashboard → Settings → API

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Found in: Supabase Dashboard → Settings → API

### How to Set Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add each required variable with its corresponding value

### Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18.x or higher

### Troubleshooting

#### Build Fails with "Missing env.NEXT_PUBLIC_SUPABASE_URL"

This error occurs when the Supabase environment variables are not set in Netlify. The application has been configured to handle missing environment variables during build time, but you still need to set them for the application to work properly at runtime.

**Solution:**
1. Set the required environment variables in Netlify
2. Redeploy your site

#### Environment Variables Not Working

- Ensure variable names are exactly as specified (case-sensitive)
- Make sure there are no extra spaces in the values
- Redeploy after adding/changing variables

### Security Notes

- Never commit actual environment variable values to your repository
- Use the `.env.example` file as a template
- The `NEXT_PUBLIC_` prefix makes variables available to the browser, so only use it for non-sensitive data
- Keep sensitive keys (like `SUPABASE_SERVICE_ROLE_KEY`) without the `NEXT_PUBLIC_` prefix

### Additional Configuration

For full functionality, you may also want to configure:

- **SUPABASE_SERVICE_ROLE_KEY** (for server-side operations)
- **NEXTAUTH_URL** (set to your Netlify domain)
- **NEXTAUTH_SECRET** (generate a secure random string)
- Other service-specific variables as needed

Refer to `.env.example` for a complete list of available configuration options.