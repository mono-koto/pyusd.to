// app/providers.tsx
"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";

import { goerli, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { HelmetProvider } from "react-helmet-async";
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    ...(import.meta.env.VITE_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY! }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Fluffy Clouds",
  projectId: "959d669d896f2e3489cb448068b3af3c",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const helmetContext = {};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider context={helmetContext}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      </WagmiConfig>
    </HelmetProvider>
  );
}

export default Providers;
