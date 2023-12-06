import { ConnectButton } from '@rainbow-me/rainbowkit';
import Logo from './logo-svg';
import { ThemeToggle } from './theme-toggle';

import Link from 'next/link';
import { Suspense } from 'react';
import Loading from './loading';
import { AboutDialogLink } from './about-dialog-link';
import { SecurityDialogLink } from './security-dialog-link';

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

        <main className="container mx-auto flex max-w-2xl flex-1 flex-col p-2">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>

        <footer className="grow-0 text-center text-xs leading-5">
          <AboutDialogLink content="How & why?" /> |{' '}
          <SecurityDialogLink content="Security + Safety" /> |{' '}
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
          <br />
          Made with 🔥💜🔥 by{' '}
          <a target="_blank" href="https://mono-koto.com/">
            Mono Koto
          </a>{' '}
          +{' '}
          <a target="_blank" href="https://gardenlabs.xyz/">
            Garden Labs
          </a>
        </footer>
      </div>
    </>
  );
}
