import { Address } from 'viem';
import { mainnet, goerli, localhost } from 'viem/chains';
import { TokenDetails } from '@/models';
import tokensMainnet from '@/assets/tokens-mainnet.json';
import tokensGoerli from '@/assets/tokens-goerli.json';
import { normalizeTokens } from './lib/token';

const preferredTokens = ['ETH', 'USDC', 'USDT', 'DAI', 'WETH', 'WBTC'];

export const coreConfig = {
  alchemyAPIKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
  infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY as string,
  enableTestnets: process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true',
};

export interface NetworkDependentConfig {
  initialSellTokenAddress: Address;
  buyTokenAddress: Address;
  tokenList: TokenDetails[];
  preferredTokens: string[];
  uniswapV3SubgraphURL: string;
}

export const networkDependentConfig: Record<number, NetworkDependentConfig> = {
  [mainnet.id]: {
    initialSellTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    buyTokenAddress: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
    tokenList: normalizeTokens(tokensMainnet as TokenDetails[]),
    preferredTokens,
    uniswapV3SubgraphURL:
      'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
  [goerli.id]: {
    initialSellTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    buyTokenAddress: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    tokenList: normalizeTokens(tokensGoerli as TokenDetails[]),
    preferredTokens,
    uniswapV3SubgraphURL:
      'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3-goerli',
  },
  [localhost.id]: {
    initialSellTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    buyTokenAddress: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
    tokenList: normalizeTokens(tokensMainnet as TokenDetails[]),
    preferredTokens,
    uniswapV3SubgraphURL:
      'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
};
