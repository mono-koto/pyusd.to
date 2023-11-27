import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/lib/utils';
import Providers from '@/components/providers';
import MainLayout from '@/components/layout-wrapper';
import { Suspense } from 'react';
import SuspenseFallback from '@/components/SuspenseFallback';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'PYUSD.to',
  description: 'Send and receive PYUSD easily using memorable URLs',
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
          <MainLayout>
            <Suspense fallback={<SuspenseFallback />}>{children}</Suspense>
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
