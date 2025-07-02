import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClientProvider } from '@/components/providers/client-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { RevenueCatProvider } from '@/components/providers/revenuecat-provider';
import { FlutterwaveProvider } from '@/components/providers/flutterwave-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Subie - Subscription Management Made Simple',
  description: 'Track and manage all your subscriptions in one place with Subie',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          <AuthProvider>
            <RevenueCatProvider>
              <FlutterwaveProvider>
                {children}
              </FlutterwaveProvider>
            </RevenueCatProvider>
          </AuthProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
