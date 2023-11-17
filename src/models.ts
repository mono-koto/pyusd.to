import { Address } from 'viem';

export interface TokenDetails {
  symbol: string;
  name: string;
  address: Address;
  decimals: number;
  chainId: number;
  logoURI: string;
}
