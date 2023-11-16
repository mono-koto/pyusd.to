import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";

import { HelmetProvider } from "react-helmet-async";
// import CustomAvatar from "./CustomAvatar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./theme-provider";
import { useTheme } from "next-themes";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, ...(process.env.VITE_ENABLE_TESTNETS === "true" ? [goerli] : [])],
  [
    alchemyProvider({ apiKey: process.env.VITE_ALCHEMY_API_KEY as string }),
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

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      {children}

      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <Web3Providers>{children}</Web3Providers>
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

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

export default Providers;
