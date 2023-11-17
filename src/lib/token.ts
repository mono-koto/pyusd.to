import { Address } from 'viem';
import { TokenDetails } from '@/models';

export function sortTokens(tokens: TokenDetails[]) {
  return [...tokens].sort((a, b) => {
    if (a.symbol < b.symbol) {
      return -1;
    } else {
      return 1;
    }
  });
}

export function backupTokenUri(address: Address) {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
}
