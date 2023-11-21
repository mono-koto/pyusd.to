import { getEthersProvider, walletClientToSigner } from '@/lib/viemEthers';
import React from 'react';
import { useChainId, usePublicClient, useWalletClient } from 'wagmi';

export function useEthersProvider() {
  const chainId = useChainId();
  return getEthersProvider({ chainId });
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}
