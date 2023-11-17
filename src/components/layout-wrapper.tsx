import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ThemeToggle } from "./ThemeToggle";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className='min-h-screen h-full flex flex-col justify-between p-5 gap-4'>
        <nav className='flex flex-row justify-between  items-top'>
          <div className='text-2xl flex flex-row gap-4 items-center'>
            <div></div>
          </div>
          <div className='flex flex-row gap-4 items-center'>
            <ConnectButton />
            <ThemeToggle />
          </div>
        </nav>

        <main className='container mx-auto max-w-xl'>{children}</main>

        <footer className='text-center text-sm'></footer>
      </div>
    </>
  );
}
