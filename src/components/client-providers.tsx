'use client';

import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import CustomAvatar from './custom-avatar';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID as string,
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Fluffy Clouds',
  projectId: '959d669d896f2e3489cb448068b3af3c',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient();

function ClientProviders({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  /// hack to move theme to client to avoid hydration mismatch
  const [rainbowTheme, setRainbowTheme] = useState<string | undefined>('light');
  useEffect(() => {
    if (theme === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)')) {
        setRainbowTheme('dark');
      } else {
        setRainbowTheme('light');
      }
    } else {
      setRainbowTheme(theme);
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          avatar={CustomAvatar}
          theme={rainbowTheme === 'dark' ? darkTheme() : lightTheme()}
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default ClientProviders;
