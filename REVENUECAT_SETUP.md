# RevenueCat Setup Guide

This guide will help you set up RevenueCat for subscription management in your Subie application.

## Overview

The error you're seeing indicates that the RevenueCat API key is either missing or invalid. RevenueCat requires a **Web Billing API key** (not a mobile SDK key) for web applications.

## Step 1: Create a RevenueCat Account

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Sign up for a free account
3. Create a new project

## Step 2: Get Your Web Billing API Key

1. In the RevenueCat dashboard, go to **Project Settings**
2. Navigate to **API Keys**
3. Look for the **Web Billing** section (NOT the mobile SDK keys)
4. Copy your **Public API Key** from the Web Billing section

⚠️ **Important**: Make sure you're using the **Web Billing API key**, not the mobile SDK key. The error message specifically mentions "Use your Web Billing or Paddle API key."

## Step 3: Configure Environment Variables

Add the following to your `.env` file:

```bash
# RevenueCat Configuration
NEXT_PUBLIC_REVENUECAT_API_KEY=your_actual_web_billing_api_key_here
REVENUECAT_SECRET_KEY=your_revenuecat_secret_key_here
```

**Replace the placeholder values with your actual API keys from RevenueCat.**

## Step 4: Set Up Products and Entitlements

1. In RevenueCat dashboard, go to **Products**
2. Create your subscription products (e.g., "Standard Monthly", "Premium Annual")
3. Set up **Entitlements** (e.g., "standard", "premium")
4. Link your products to the appropriate entitlements

## Step 5: Configure Offerings

1. Go to **Offerings** in the RevenueCat dashboard
2. Create an offering (e.g., "Default")
3. Add your products to the offering
4. Make sure the offering is set as "Current"

## Step 6: Test Your Setup

1. Restart your development server after adding the environment variables
2. Check the browser console for any RevenueCat initialization errors
3. The error should be resolved if the API key is valid

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**:
   - Make sure you're using the Web Billing API key, not the mobile SDK key
   - Verify the API key is correctly copied without extra spaces

2. **"API key not found" error**:
   - Check that `NEXT_PUBLIC_REVENUECAT_API_KEY` is set in your `.env` file
   - Restart your development server after adding the environment variable

3. **No products available**:
   - Ensure you've created products and offerings in the RevenueCat dashboard
   - Check that your offering is set as "Current"

### Development vs Production

- For development: Use the sandbox/test API keys
- For production: Use the production API keys
- Make sure your environment variables match your current environment

## API Key Types in RevenueCat

| Key Type | Purpose | Where to Use |
|----------|---------|-------------|
| Mobile SDK Keys | iOS/Android apps | Not for web |
| Web Billing Keys | Web applications | ✅ Use this one |
| Secret Keys | Server-side operations | Backend only |

## Next Steps

Once RevenueCat is properly configured:

1. Test the subscription flow in your application
2. Set up webhooks for real-time subscription updates
3. Configure your payment processor (Stripe, etc.) in RevenueCat
4. Test the complete purchase flow

## Support

If you continue to have issues:

1. Check the [RevenueCat Documentation](https://docs.revenuecat.com/docs/web)
2. Verify your API key type in the RevenueCat dashboard
3. Contact RevenueCat support if the API key appears correct but still doesn't work

---

**Remember**: The `NEXT_PUBLIC_` prefix is required for environment variables that need to be accessible in the browser. Never expose secret keys with this prefix.