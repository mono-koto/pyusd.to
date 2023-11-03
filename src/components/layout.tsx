import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Helmet } from "react-helmet-async";
import { BanknotesIcon } from "@heroicons/react/24/solid";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Helmet>
        <title>Fluffy Clouds</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>

      <div className="h-min-screen h-full flex flex-col justify-between p-5 gap-4">
        <nav className="flex flex-row justify-between   items-top">
          <div className="text-2xl flex flex-row gap-4 items-center">
            <div>
              <BanknotesIcon />
            </div>
          </div>

          <ConnectButton />
        </nav>

        <main className="container mx-auto">{children}</main>
        <footer>
          <a
            href="https://github.com/mono-koto/radiant-saga"
            rel="noopener noreferrer"
            target="_blank"
          >
            {/* Created by <Link href="https://mono-koto.com/">Mono Koto</Link> +{" "}
            <Link href="https://www.gardenlabs.xyz/">Garden Labs</Link> */}
          </a>
        </footer>
      </div>
    </>
  );
}
