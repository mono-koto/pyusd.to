import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ThemeToggle } from './ThemeToggle';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-full min-h-screen flex-col justify-between gap-4 p-5">
        <nav className="items-top flex flex-row  justify-between">
          <div className="flex flex-row items-center gap-4 text-2xl">
            <div></div>
          </div>
          <div className="flex flex-row items-center gap-4">
            <ConnectButton />
            <ThemeToggle />
          </div>
        </nav>

        <main className="container mx-auto max-w-xl">{children}</main>

        <footer className="text-center text-sm"></footer>
      </div>
    </>
  );
}
