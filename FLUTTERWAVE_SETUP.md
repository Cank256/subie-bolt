# Flutterwave Setup Guide

This guide will help you configure Flutterwave as your payment gateway for subscription management in your application.

## Prerequisites

- A Flutterwave account (sign up at [flutterwave.com](https://flutterwave.com))
- Access to your Flutterwave Dashboard
- Your application environment variables configured

## Step 1: Get Your Flutterwave API Keys

1. **Log in to your Flutterwave Dashboard**
   - Go to [dashboard.flutterwave.com](https://dashboard.flutterwave.com)
   - Sign in with your credentials

2. **Navigate to API Keys**
   - Go to Settings → API Keys
   - You'll see both Test and Live API keys

3. **Copy Your Keys**
   - **Public Key**: Used for client-side operations (starts with `FLWPUBK_`)
   - **Secret Key**: Used for server-side operations (starts with `FLWSECK_`)

   **Important**: Use Test keys for development and Live keys for production.

## Step 2: Configure Environment Variables

Add the following environment variables to your `.env` file:

```env
# Flutterwave Configuration
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key_here
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key_here
```

### For Development (Test Mode)
```env
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
```

### For Production (Live Mode)
```env
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
```

## Step 3: Configure Subscription Plans

The application comes with predefined subscription plans:

### Standard Plan
- **Monthly**: $9.99
- **Annual**: $99.99 (2 months free)
- **Features**: Up to 25 subscriptions, SMS & Email notifications, Advanced analytics

### Premium Plan
- **Monthly**: $19.99
- **Annual**: $199.99 (2 months free)
- **Features**: Unlimited subscriptions, All notification types, API access, White-label options

## Step 4: Set Up Webhooks (Optional but Recommended)

1. **In your Flutterwave Dashboard**
   - Go to Settings → Webhooks
   - Add a new webhook endpoint

2. **Webhook URL**
   ```
   https://yourdomain.com/api/webhooks/flutterwave
   ```

3. **Events to Subscribe To**
   - `charge.completed`
   - `transfer.completed`
   - `subscription.cancelled`

## Step 5: Test the Integration

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Test Payment Flow**
   - Navigate to your subscription page
   - Select a plan (Standard or Premium)
   - Choose billing cycle (Monthly or Annual)
   - Click "Subscribe" to initiate payment

3. **Use Test Cards** (for development)
   ```
   # Successful Payment
   Card Number: 5531886652142950
   CVV: 564
   Expiry: 09/32
   PIN: 3310
   OTP: 12345

   # Insufficient Funds
   Card Number: 5060666666666666666
   CVV: 123
   Expiry: 09/32
   PIN: 3310
   ```

## Step 6: Configure Payment Settings in Admin

1. **Access Admin Settings**
   - Navigate to `/admin/settings`
   - Go to the "Billing" section

2. **Set Flutterwave as Default**
   - Select "Flutterwave" as the payment provider
   - Enter your Flutterwave keys
   - Save the settings

## Usage in Components

### Using the Flutterwave Hook

```tsx
import { useFlutterwave } from '@/hooks/use-flutterwave';

function SubscriptionComponent() {
  const {
    isInitialized,
    isLoading,
    hasActiveSubscription,
    subscriptionPlan,
    processPayment,
    getPlanPrice,
    getPlanFeatures
  } = useFlutterwave();

  const handleSubscribe = async () => {
    try {
      await processPayment('premium', 'monthly');
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div>
      {hasActiveSubscription ? (
        <p>Active Plan: {subscriptionPlan}</p>
      ) : (
        <button onClick={handleSubscribe} disabled={isLoading}>
          Subscribe to Premium
        </button>
      )}
    </div>
  );
}
```

### Using the Flutterwave Provider Context

```tsx
import { useFlutterwaveContext } from '@/components/providers/flutterwave-provider';

function PaymentComponent() {
  const { processPayment, isLoading } = useFlutterwaveContext();

  // Component logic here
}
```

## Troubleshooting

### Common Issues

1. **"Flutterwave public key not configured" Error**
   - Ensure `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` is set in your `.env` file
   - Restart your development server after adding environment variables
   - Check that the key starts with `FLWPUBK_`

2. **Payment Modal Not Opening**
   - Check browser console for JavaScript errors
   - Ensure Flutterwave script is loaded properly
   - Verify your public key is valid

3. **"Invalid API Key" Error**
   - Double-check your API keys in the Flutterwave Dashboard
   - Ensure you're using the correct keys for your environment (Test vs Live)
   - Verify there are no extra spaces or characters in your keys

4. **Webhook Not Receiving Events**
   - Check that your webhook URL is publicly accessible
   - Verify the webhook URL in your Flutterwave Dashboard
   - Check your server logs for incoming webhook requests

### Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Flutterwave initializes without errors
- [ ] Payment modal opens when clicking subscribe
- [ ] Test payments complete successfully
- [ ] Subscription status updates after payment
- [ ] Error handling works for failed payments
- [ ] Webhooks receive and process events correctly

## Security Best Practices

1. **Never expose your Secret Key**
   - Keep `FLUTTERWAVE_SECRET_KEY` server-side only
   - Never include it in client-side code
   - Use environment variables, not hardcoded values

2. **Validate Webhooks**
   - Always verify webhook signatures
   - Implement proper error handling
   - Log webhook events for debugging

3. **Use HTTPS**
   - Always use HTTPS in production
   - Ensure webhook URLs use HTTPS

## Support

- **Flutterwave Documentation**: [developer.flutterwave.com](https://developer.flutterwave.com)
- **Flutterwave Support**: [support.flutterwave.com](https://support.flutterwave.com)
- **Test Cards**: [developer.flutterwave.com/docs/test-cards](https://developer.flutterwave.com/docs/test-cards)

## Next Steps

1. Set up webhook endpoints for real-time payment updates
2. Implement subscription management features
3. Add payment analytics and reporting
4. Configure email notifications for payment events
5. Set up automated subscription renewals