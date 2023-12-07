import { Address } from 'viem';
import { mainnet, goerli, localhost } from 'viem/chains';
import { TokenDetails } from '@/models';
import tokensMainnet from '@/assets/tokens-mainnet.json';
import tokensGoerli from '@/assets/tokens-goerli.json';
import { normalizeTokens } from './lib/token';

/// For swaps
export const preferredTokenSymbols = [
  'ETH',
  'PYUSD',
  'USDC',
  'USDT',
  'DAI',
  'WETH',
  'WBTC',
];

/// For display
export const favoriteTokenSymbols = [
  'ETH',
  'WETH',
  'BTC',
  'USDC',
  'DAI',
  'USDT',
  'SUSHI',
  'UNI',
  'CRV',
  'SHIB',
  'FRAX',
  'MIM',
  'ALCX',
  'COW',
  'BTRFLY',
  'BAL',
  'AAVE',
  'LINK',
  'MKR',
  'SNX',
  'YFI',
  'COMP',
  'FTT',
  'MATIC',
  'SOL',
  'AVAX',
  'LUNA',
  'ATOM',
  'DOT',
  'KSM',
  'BNB',
  'CAKE',
  'BUSD',
  'BAND',
  'RUNE',
];

export const tokenLists = {
  mainnet: tokensMainnet,
};

export interface NetworkDependentConfig {
  initialSellTokenAddress: Address;
  buyTokenAddress: Address;
  tokenList: TokenDetails[];
  preferredTokenSymbols: string[];
}

export const networkDependentConfig: Record<number, NetworkDependentConfig> = {
  [mainnet.id]: {
    initialSellTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    buyTokenAddress: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
    tokenList: normalizeTokens(tokensMainnet as TokenDetails[]),
    preferredTokenSymbols,
  },
  [goerli.id]: {
    initialSellTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    buyTokenAddress: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    tokenList: normalizeTokens(tokensGoerli as TokenDetails[]),
    preferredTokenSymbols,
  },
  [localhost.id]: {
    initialSellTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    buyTokenAddress: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
    tokenList: normalizeTokens(tokensMainnet as TokenDetails[]),
    preferredTokenSymbols,
  },
};
