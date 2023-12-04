import { alchemyForChain } from '@/lib/alchemy';
import { useMemo } from 'react';
import { useChainId } from 'wagmi';

export const useAlchemy = () => {
  const chainId = useChainId();
  return useMemo(() => alchemyForChain(chainId), [chainId]);
};
