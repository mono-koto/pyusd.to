import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Helmet>
        <title>Fluffy Clouds</title>
        {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
      </Helmet>

      <div className="min-h-screen h-full flex flex-col justify-between p-5 gap-4">
        <nav className="flex flex-row justify-between  items-top">
          <div className="text-2xl flex flex-row gap-4 items-center">
            <div></div>
          </div>

          <ConnectButton />
        </nav>

        <main className="container mx-auto max-w-xl">{children}</main>
        <footer className="text-center text-sm">
          Created by <a href="https://mono-koto.com/">Mono Koto</a> +{" "}
          <a href="https://www.gardenlabs.xyz/">Garden Labs</a>
        </footer>
      </div>
    </>
  );
}
