import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ThemeToggle } from './theme-toggle';
import { ShareButton } from './share-button';
import Logo from './logo-svg';

import Link from 'next/link';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-full min-h-screen flex-col justify-stretch gap-4 p-2 md:p-5">
        <nav className="items-top flex flex-row justify-between">
          <div className="flex flex-row items-center text-2xl">
            <div className="h-[50px]">
              <Link href="/">
                <Logo />
              </Link>
            </div>
          </div>
          <div className="flex flex-row items-center gap-1 md:gap-4">
            <ShareButton address="" />
            <ThemeToggle />
            <ConnectButton showBalance={false} label="Connect" />
          </div>
        </nav>

        <main className="mx-auto max-w-xl flex-1 px-2 md:container">
          {children}
        </main>

        <footer className="grow-0 text-center text-sm">
          Made with ❤️ by Garden Labs + Mono Koto
        </footer>
      </div>
    </>
  );
}
