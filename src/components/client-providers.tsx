'use client';

import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { goerli, localhost, mainnet } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import CustomAvatar from './custom-avatar';
import { coreConfig } from '@/config';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, ...(coreConfig.enableTestnets ? [goerli, localhost] : [])],
  [
    alchemyProvider({
      apiKey: coreConfig.alchemyAPIKey,
    }),
    infuraProvider({
      apiKey: coreConfig.infuraAPIKey,
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
  const [thirdPartyTheme, setThirdPartyTheme] = useState<'dark' | 'light'>(
    'light'
  );
  useEffect(() => {
    if (theme === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)')) {
        setThirdPartyTheme('dark');
      } else {
        setThirdPartyTheme('light');
      }
    } else if (theme === 'dark' || theme === 'light') {
      setThirdPartyTheme(theme);
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          avatar={CustomAvatar}
          theme={thirdPartyTheme === 'dark' ? darkTheme() : lightTheme()}
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default ClientProviders;
