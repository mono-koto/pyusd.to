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
      <div className="flex h-full min-h-screen flex-col justify-between gap-4 p-5">
        <nav className="items-top flex flex-row justify-between">
          <div className="flex flex-row items-center gap-4 text-2xl">
            <div className="h-[50px]">
              <Link href="/">
                <Logo />
              </Link>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4">
            <ShareButton address="" />
            <ThemeToggle />
            <ConnectButton />
          </div>
        </nav>

        <main className="container mx-auto max-w-xl">{children}</main>

        <footer className="text-center text-sm"></footer>
      </div>
    </>
  );
}
