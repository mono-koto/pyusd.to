import { coreConfig } from '@/config';
import { Alchemy, Network } from 'alchemy-sdk';

export function alchemyNetwork(chainId: number) {
  switch (chainId) {
    case 1:
      return Network.ETH_MAINNET;
    case 5:
      return Network.ETH_GOERLI;
    default:
      return Network.ETH_MAINNET;
  }
}

export function alchemyForChain(chainId: number) {
  const network = alchemyNetwork(chainId);
  return new Alchemy({
    apiKey: coreConfig.alchemyAPIKey,
    network,
  });
}

export function alchemyURL(chainId: number) {
  console.log();
  const network = chainId === 5 ? 'goerli' : 'mainnet'; // todo - generalize
  return `https://eth-${network}.alchemyapi.io/v2/${coreConfig.alchemyAPIKey}`;
}
