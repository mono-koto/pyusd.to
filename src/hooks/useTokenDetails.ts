import { backupTokenUri } from '@/lib/token';
import { TokenDetails } from '@/models';
import { Address } from 'viem';
import { useChainId, useToken } from 'wagmi';
import useConfig from './useConfig';
import { useMemo } from 'react';

export function useTokenDetails(address: Address): {
  data: TokenDetails | undefined;
  status: 'success' | 'error' | 'loading' | 'idle';
} {
  const chainId = useChainId();
  const tokenList = useConfig().tokenList;
  const tokenMap = useMemo(
    () =>
      new Map<string, TokenDetails>(
        tokenList.map((token: TokenDetails) => [token.address, token])
      ),
    [tokenList]
  );

  const tokenDetails = tokenMap.get(address);

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
        logoURI: backupTokenUri(address),
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
