import { Address } from 'viem';
import { mainnet, goerli, localhost } from 'viem/chains';
import { TokenDetails } from '@/models';
import tokensMainnet from '@/assets/tokens-mainnet.json';
import tokensGoerli from '@/assets/tokens-goerli.json';
import { normalizeTokens } from './lib/token';

export interface NetworkDependentConfig {
  initialSellTokenAddress: Address;
  buyTokenAddress: Address;
  tokenList: TokenDetails[];
  preferredTokens: string[];
}

export const networkDependentConfig: Record<number, NetworkDependentConfig> = {
  [mainnet.id]: {
    initialSellTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    buyTokenAddress: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
    tokenList: normalizeTokens(tokensMainnet as TokenDetails[]),
    preferredTokens: ['ETH', 'USDC', 'USDT', 'DAI', 'WETH', 'WBTC'],
  },
  [goerli.id]: {
    initialSellTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    buyTokenAddress: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    tokenList: normalizeTokens(tokensGoerli as TokenDetails[]),
    preferredTokens: ['ETH', 'USDC', 'USDT', 'DAI', 'WETH', 'WBTC'],
  },
  [localhost.id]: {
    initialSellTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    buyTokenAddress: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
    tokenList: normalizeTokens(tokensMainnet as TokenDetails[]),
    preferredTokens: ['ETH', 'USDC', 'USDT', 'DAI', 'WETH', 'WBTC'],
  },
};
