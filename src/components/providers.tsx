"use client";

import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./theme-provider";
import Web3Providers from "./web3-providers";

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
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <Web3Providers>{children}</Web3Providers>
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default Providers;
