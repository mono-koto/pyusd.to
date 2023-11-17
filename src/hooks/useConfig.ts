import { networkDependentConfig } from '@/config';
import { useChainId } from 'wagmi';

export default function useConfig() {
  const chainId = useChainId();
  return networkDependentConfig[chainId];
}
