import { useMemo } from 'react';
import useConfig from './useConfig';
import { TokenDetails } from '@/models';

export function useTokens() {
  return useConfig().tokenList;
}

export function useNamedTokens(symbols: string[]): TokenDetails[] {
  const tokens = useTokens();
  return useMemo(() => {
    return symbols
      .map((symbol) => tokens.find((t) => t.symbol === symbol))
      .filter((t: TokenDetails | undefined): t is TokenDetails => Boolean(t));
  }, [tokens, symbols]);
}

export function usePreferredTokens(): TokenDetails[] {
  const preferredTokens = useConfig().preferredTokens;
  return useNamedTokens(preferredTokens);
}
