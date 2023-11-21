import { backupTokenUri } from '@/lib/token';
import { TokenDetails } from '@/models';
import { useMemo } from 'react';
import { Address } from 'viem';
import { useChainId, useToken } from 'wagmi';
import useConfig from './useConfig';

export interface TokenDetailsResult {
  data: TokenDetails | undefined;
  status: 'success' | 'error' | 'loading' | 'idle';
}

/// Consult local token list details before going out to network
export function useTokenDetails(address?: Address): TokenDetailsResult {
  const chainId = useChainId();
  const tokenList = useConfig().tokenList;
  const tokenMap = useMemo(
    () =>
      new Map<string, TokenDetails>(
        tokenList.map((token: TokenDetails) => [token.address, token])
      ),
    [tokenList]
  );

  const tokenDetails = address && tokenMap.get(address.toLowerCase());

  const tokenQuery = useToken({
    address,
    enabled: !tokenDetails,
  });

  if (tokenDetails) {
    return {
      data: tokenDetails,
      status: 'success',
    };
  } else if (tokenQuery.data) {
    return {
      data: {
        ...tokenQuery.data,
        chainId,
        logoURI: address ? backupTokenUri(address) : '', // TODO: use a placeholder image
      },
      status: 'success',
    };
  } else {
    return {
      data: undefined,
      status: tokenQuery.status,
    };
  }
}
