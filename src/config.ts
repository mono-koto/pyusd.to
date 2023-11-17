import { Address } from 'viem';
import { mainnet, goerli } from 'viem/chains';
import { TokenDetails } from '@/models';
import tokensMainnet from '@/assets/tokens-mainnet.json';
import tokensGoerli from '@/assets/tokens-goerli.json';

export interface NetworkDependentConfig {
  initialSellTokenAddress: Address;
  buyTokenAddress: Address;
  tokenList: TokenDetails[];
}

export const networkDependentConfig: Record<number, NetworkDependentConfig> = {
  [mainnet.id]: {
    initialSellTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    buyTokenAddress: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
    tokenList: tokensMainnet as TokenDetails[],
  },
  [goerli.id]: {
    initialSellTokenAddress: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    buyTokenAddress: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    tokenList: tokensGoerli as TokenDetails[],
  },
};
