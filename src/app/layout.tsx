import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';

import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/lib/utils';
import Providers from '@/components/providers';
import LayoutWrapper from '@/components/layout-wrapper';
import { Suspense } from 'react';
import SuspenseFallback from '@/components/loading';
import { ToastContainer } from 'react-toastify';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    template: 'PYUSD.to/%s',
    default: 'PYUSD.to',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers>
          <LayoutWrapper>
            <Suspense fallback={<SuspenseFallback />}>{children}</Suspense>
            <ToastContainer
              position="bottom-right"
              pauseOnFocusLoss={false}
              theme={'light'}
            />
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
