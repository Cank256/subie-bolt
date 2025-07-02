# Flutterwave Integration Guide

This document outlines the Flutterwave integration implemented in the Subie subscription management application.

## Overview

Flutterwave has been integrated as the default payment gateway to handle subscription payments and management for different plan tiers (Free, Standard, Premium). The integration provides:

- Secure payment processing for subscription plans
- Automatic subscription management and renewal tracking
- Transaction verification and recording
- Integration with Supabase for user subscription data
- Support for monthly and annual billing cycles

## Setup Instructions

### 1. Flutterwave Dashboard Setup

1. Create a Flutterwave account at [https://dashboard.flutterwave.com](https://dashboard.flutterwave.com)
2. Complete your business verification
3. Navigate to **Settings > API Keys**
4. Copy your **Public Key** and **Secret Key**

### 2. Environment Configuration

Add your Flutterwave API keys to your `.env` file:

```env
# Flutterwave Configuration
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
```

**Important:** Replace `your_flutterwave_public_key` and `your_flutterwave_secret_key` with your actual Flutterwave API keys from the dashboard.

### 3. Dependencies

The integration uses Flutterwave's inline payment script, which is loaded dynamically. No additional npm packages are required.

## File Structure

The Flutterwave integration consists of the following files:

```
lib/flutterwave/
├── client.ts                 # Flutterwave service client

hooks/
├── use-flutterwave.ts        # React hook for Flutterwave functionality

components/providers/
├── flutterwave-provider.tsx  # Context provider for Flutterwave

app/
├── layout.tsx               # Updated to include Flutterwave provider
├── pricing/page.tsx         # Updated to use Flutterwave
├── billing/page.tsx         # Updated to use Flutterwave
```

## Key Features

### Payment Processing
- Integration with Flutterwave's inline payment for seamless checkout
- Support for multiple payment methods (cards, bank transfers, mobile money)
- Automatic transaction verification
- Real-time payment status updates

### Subscription Management
- Automatic subscription activation upon successful payment
- Subscription expiration tracking
- Plan upgrade/downgrade support
- Billing cycle management (monthly/annual)

### Security
- Server-side transaction verification
- Secure API key management
- Payment data encryption
- PCI DSS compliance through Flutterwave

## Usage Examples

### Using the Flutterwave Hook

```tsx
import { useFlutterwave } from '@/hooks/use-flutterwave';

function PricingComponent() {
  const {
    isInitialized,
    isLoading,
    error,
    hasActiveSubscription,
    subscriptionPlan,
    expiresAt,
    processPayment,
    refreshSubscriptionStatus
  } = useFlutterwave();

  const handlePurchase = async (planType: 'standard' | 'premium', billingCycle: 'monthly' | 'annual') => {
    try {
      await processPayment(planType, billingCycle);
      console.log('Payment successful!');
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div>
      {hasActiveSubscription ? (
        <p>Current plan: {subscriptionPlan}</p>
      ) : (
        <button onClick={() => handlePurchase('standard', 'monthly')}>
          Subscribe to Standard Plan
        </button>
      )}
    </div>
  );
}
```

### Using the Provider Context

```tsx
import { useFlutterwaveContext } from '@/components/providers/flutterwave-provider';

function SubscriptionStatus() {
  const { hasActiveSubscription, subscriptionPlan, expiresAt } = useFlutterwaveContext();

  return (
    <div>
      <h3>Subscription Status</h3>
      <p>Active: {hasActiveSubscription ? 'Yes' : 'No'}</p>
      <p>Plan: {subscriptionPlan}</p>
      {expiresAt && <p>Expires: {new Date(expiresAt).toLocaleDateString()}</p>}
    </div>
  );
}
```

## Data Synchronization

The integration automatically synchronizes Flutterwave payment data with Supabase:

### User Subscription Updates
- `subscription_plan`: Updated to reflect the purchased plan
- `subscription_status`: Set to 'active' upon successful payment
- `subscription_expires_at`: Calculated based on billing cycle
- `updated_at`: Timestamp of the last update

### Transaction Records
- `transaction_id`: Flutterwave transaction reference
- `amount`: Payment amount
- `currency`: Payment currency (USD)
- `status`: Transaction status
- `payment_method`: Set to 'flutterwave'
- `description`: Plan and billing cycle details

## Testing

### Test Mode
1. Use Flutterwave's test API keys for development
2. Use test card numbers provided by Flutterwave
3. Test different payment scenarios (success, failure, pending)

### Test Cards
- **Successful Payment**: 4187427415564246
- **Insufficient Funds**: 4000000000000002
- **Declined Payment**: 4000000000000069

## Troubleshooting

### Common Issues

1. **"Flutterwave not initialized" Error**
   - Ensure `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` is set in environment variables
   - Check that the API key is valid and not a placeholder
   - Verify the key is for the correct environment (test/live)

2. **Payment Modal Not Opening**
   - Check browser console for JavaScript errors
   - Ensure Flutterwave script is loaded properly
   - Verify payment configuration parameters

3. **Transaction Verification Failed**
   - Check that `FLUTTERWAVE_SECRET_KEY` is correctly set
   - Verify the transaction ID is valid
   - Ensure network connectivity to Flutterwave API

4. **Subscription Not Activated**
   - Check Supabase connection and permissions
   - Verify user authentication status
   - Check database table structure and RLS policies

### Debug Mode

Enable debug logging by setting the environment variable:
```env
NEXT_PUBLIC_DEBUG_FLUTTERWAVE=true
```

## Security Best Practices

1. **API Key Management**
   - Never expose secret keys in client-side code
   - Use environment variables for all sensitive data
   - Rotate API keys regularly

2. **Transaction Verification**
   - Always verify transactions server-side
   - Implement webhook endpoints for real-time updates
   - Log all payment events for audit trails

3. **User Data Protection**
   - Encrypt sensitive user information
   - Implement proper access controls
   - Follow GDPR and data protection regulations

## Webhook Configuration (Optional)

For production environments, configure webhooks to receive real-time payment updates:

1. In Flutterwave dashboard, go to **Settings > Webhooks**
2. Add your webhook URL: `https://yourdomain.com/api/webhooks/flutterwave`
3. Select relevant events (payment.completed, payment.failed)
4. Implement webhook handler in your API routes

## Admin Configuration

Administrators can configure Flutterwave settings through the admin panel:

1. Navigate to **Admin > Settings**
2. Select **Flutterwave** as the payment provider
3. Enter your Flutterwave public and secret keys
4. Save the configuration

## Support and Resources

- **Flutterwave Documentation**: [https://developer.flutterwave.com](https://developer.flutterwave.com)
- **API Reference**: [https://developer.flutterwave.com/reference](https://developer.flutterwave.com/reference)
- **Test Environment**: [https://dashboard.flutterwave.com/dashboard/settings/apis](https://dashboard.flutterwave.com/dashboard/settings/apis)
- **Support**: [https://support.flutterwave.com](https://support.flutterwave.com)

For issues related to Flutterwave integration:

1. Check the Flutterwave documentation for API changes
2. Verify your account status and API key validity
3. Check the Flutterwave dashboard for transaction details
4. Contact Flutterwave support for payment processing issues

## Migration from RevenueCat

If migrating from RevenueCat to Flutterwave:

1. Update environment variables to include Flutterwave keys
2. Run database migrations to update default payment provider
3. Update admin settings to use Flutterwave
4. Test payment flows thoroughly
5. Update any custom integrations or webhooks
6. Communicate changes to users if necessary

The application now defaults to Flutterwave but maintains backward compatibility with existing RevenueCat configurations.