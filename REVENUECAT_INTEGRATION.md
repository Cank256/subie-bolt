# RevenueCat Integration Guide

This document outlines the RevenueCat integration implemented in the Subie subscription management application.

## Overview

RevenueCat has been integrated to handle subscription payments and management for different plan tiers (Free, Standard, Premium). The integration provides:

- Subscription purchase flow
- Plan management and upgrades/downgrades
- Purchase restoration
- Subscription status tracking
- Synchronization with Supabase user profiles

## Setup Instructions

### 1. RevenueCat Dashboard Setup

1. Create a RevenueCat account at [https://app.revenuecat.com](https://app.revenuecat.com)
2. Create a new project for your app
3. Configure your products/subscriptions:
   - `standard_monthly` - Standard plan monthly subscription
   - `standard_annual` - Standard plan annual subscription
   - `premium_monthly` - Premium plan monthly subscription
   - `premium_annual` - Premium plan annual subscription

### 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# RevenueCat Configuration
NEXT_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_public_api_key
REVENUECAT_SECRET_KEY=your_revenuecat_secret_key
```

**Important:** Replace `your_revenuecat_public_api_key` and `your_revenuecat_secret_key` with your actual RevenueCat API keys from the dashboard.

### 3. Package Installation

The required package is already installed:

```bash
npm install @revenuecat/purchases-js
```

## File Structure

The RevenueCat integration consists of the following files:

```
lib/revenuecat/
├── client.ts                 # RevenueCat service client

hooks/
├── use-revenuecat.ts        # React hook for RevenueCat functionality

components/providers/
├── revenuecat-provider.tsx  # Context provider for RevenueCat

app/
├── layout.tsx               # Updated to include RevenueCat provider
├── pricing/page.tsx         # Updated with purchase functionality
├── billing/page.tsx         # Updated with subscription management
```

## Key Features

### 1. Subscription Purchase Flow

- Users can purchase subscriptions directly from the pricing page
- Integration with RevenueCat's web SDK for payment processing
- Automatic synchronization with Supabase user profiles

### 2. Plan Management

- Current subscription status display
- Upgrade/downgrade functionality
- Next billing date information
- Purchase restoration

### 3. User Experience

- Loading states during purchase operations
- Error handling with user-friendly messages
- Toast notifications for successful/failed operations
- Responsive design for all screen sizes

## Usage Examples

### Using the RevenueCat Hook

```tsx
import { useRevenueCatContext } from '@/components/providers/revenuecat-provider';

function MyComponent() {
  const {
    subscriptionPlan,
    hasActiveSubscription,
    purchasePackage,
    restorePurchases,
    isLoading
  } = useRevenueCatContext();

  // Component logic here
}
```

### Purchasing a Package

```tsx
const handlePurchase = async (packageId: string) => {
  const packageToPurchase = getPackageByIdentifier(packageId);
  if (packageToPurchase) {
    await purchasePackage(packageToPurchase);
  }
};
```

## Data Synchronization

The integration automatically synchronizes RevenueCat subscription data with Supabase:

- `subscription_plan`: Current plan (free, standard, premium)
- `plan_expires_at`: Next billing/expiration date
- `updated_at`: Last synchronization timestamp

## Error Handling

The integration includes comprehensive error handling:

- Network connectivity issues
- Payment processing failures
- Invalid package identifiers
- User authentication errors

Errors are logged to the console and displayed to users via toast notifications.

## Testing

### Development Testing

1. Use RevenueCat's sandbox environment for testing
2. Configure test products in the RevenueCat dashboard
3. Use test payment methods for purchase flows

### Production Deployment

1. Switch to production API keys
2. Configure production products
3. Test with real payment methods
4. Monitor RevenueCat dashboard for subscription events

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Ensure `NEXT_PUBLIC_REVENUECAT_API_KEY` is set in environment variables
   - Check that the API key is correct and active

2. **Package Not Found**
   - Verify product identifiers match those configured in RevenueCat dashboard
   - Ensure products are active and properly configured

3. **Purchase Failures**
   - Check browser console for detailed error messages
   - Verify payment method is valid
   - Ensure user is properly authenticated

### Debug Mode

Enable debug logging by setting:

```env
ENABLE_DEBUG_LOGS=true
```

## Security Considerations

- API keys are properly configured as environment variables
- Client-side code only uses public API keys
- Server-side operations use secret keys (when implemented)
- User authentication is required for all purchase operations

## Future Enhancements

- Server-side webhook handling for subscription events
- Advanced analytics and reporting
- Promo codes and discount support
- Family sharing functionality
- Enterprise plan features

## Support

For issues related to RevenueCat integration:

1. Check the RevenueCat documentation: [https://docs.revenuecat.com](https://docs.revenuecat.com)
2. Review the browser console for error messages
3. Check the RevenueCat dashboard for subscription events
4. Contact RevenueCat support for payment processing issues