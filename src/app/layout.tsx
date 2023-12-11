import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';

import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import SuspenseFallback from '@/components/loading';
import Providers from '@/components/providers';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import LayoutWrapper from '@/components/layout-wrapper';
import Script from 'next/script';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    template: '%s | PYUSD.to',
    default: 'PYUSD.to',
  },
  description: 'Send payment to PayPal accounts using any token.',
  applicationName: 'PYUSD.to',
  authors: [
    {
      name: 'Mono Koto',
      url: 'https://mono-koto.com/',
    },
    {
      name: 'Garden Labs',
      url: 'https://gardenlabs.xyz/',
    },
  ],
  creator: 'Mono Koto',
  keywords: [
    'PYUSD',
    'PayPal',
    'Ethereum',
    'Crypto',
    'Web3',
    'Payment',
    'Uniswap',
    'DEX',
    'Open Source',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_UMAMI_ID && (
          <Script
            async
            src="https://us.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
          ></Script>
        )}
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers>
          <Suspense fallback={<SuspenseFallback />}>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Suspense>
          <ToastContainer
            position="bottom-right"
            pauseOnFocusLoss={false}
            theme={'light'}
          />
        </Providers>
      </body>
    </html>
  );
}
