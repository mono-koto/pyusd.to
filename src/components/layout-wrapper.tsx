'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Logo from './logo-svg';
import { ThemeToggle } from './theme-toggle';

import Link from 'next/link';
import { Suspense } from 'react';
import HomeAnimation from './home-animation';
import Loading from './loading';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-full min-h-screen flex-col justify-stretch gap-6 p-2 md:p-5">
        <nav className="items-top flex flex-row justify-between">
          <div className="flex flex-row items-center text-2xl">
            <div className="h-[50px]">
              <Link href="/">
                <Logo dynamicHover={true} />
              </Link>
            </div>
          </div>
          <div className="flex flex-row items-center gap-1 md:gap-4">
            <ConnectButton showBalance={false} label="Connect" />
            <ThemeToggle />
          </div>
        </nav>

        <div className="h-full flex-1">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>

        <footer className="grow-0 text-center text-xs leading-5">
          <a
            target="_blank"
            href="https://pyusd-garden.gitbook.io/pyusd.to/paypal-user"
          >
            PayPal user?
          </a>{' '}
          |{' '}
          <a target="_blank" href="https://pyusd-garden.gitbook.io/pyusd.to/">
            Docs
          </a>{' '}
          |{' '}
          <a target="_blank" href="https://github.com/mono-koto/pyusd.to">
            Source
          </a>{' '}
          |{' '}
          <a
            target="_blank"
            href="https://github.com/mono-koto/pyusd.to/blob/main/LICENSE"
          >
            MIT License
          </a>{' '}
          |{' '}
          <a target="_blank" href="https://github.com/mono-koto/pyusd.to">
            GitHub
          </a>{' '}
          | Made with 🔥💜🔥 by{' '}
          <a target="_blank" href="https://mono-koto.com/">
            Mono Koto
          </a>{' '}
          +{' '}
          <a target="_blank" href="https://gardenlabs.xyz/">
            Garden Labs
          </a>
        </footer>
      </div>
      <Suspense fallback={<div />}>
        <HomeAnimation />
      </Suspense>
    </>
  );
}
