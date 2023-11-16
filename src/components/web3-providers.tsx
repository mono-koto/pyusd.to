"use client";

import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

// import CustomAvatar from "./CustomAvatar";
import { useTheme } from "next-themes";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
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

function Web3Providers({ children }: { children: React.ReactNode }) {
  const rainbowTheme = useTheme().theme === "dark" ? darkTheme() : lightTheme();
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        // avatar={CustomAvatar}
        theme={rainbowTheme}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default Web3Providers;
