import ClientProviders from "./client-providers";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <ClientProviders>{children}</ClientProviders>
    </ThemeProvider>
  );
}

export default Providers;
