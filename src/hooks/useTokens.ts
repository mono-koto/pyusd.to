import standardTokensMainnet from "cowswap-token-lists/src/public/CowSwap.json";
import standardTokensGoerli from "cowswap-token-lists/src/public/CowSwapGoerli.json";
import { goerli, mainnet } from "viem/chains";
import { useChainId } from "wagmi";
import additionalTokensMainnet from "../assets/additional-token-list-mainnet.json";

const tokensMainnet = [
  ...additionalTokensMainnet.tokens,
  ...standardTokensMainnet.tokens,
].sort((a, b) => {
  if (a.symbol < b.symbol) {
    return -1;
  } else {
    return 1;
  }
});

standardTokensGoerli.tokens.sort((a, b) => {
  if (a.symbol < b.symbol) {
    return -1;
  } else {
    return 1;
  }
});

export interface TokenListToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  chainId: number;
  logoURI: string;
}

export function useTokens(): TokenListToken[] {
  const chainId = useChainId();
  switch (chainId) {
    case mainnet.id:
      return tokensMainnet;
    case goerli.id:
      return standardTokensGoerli.tokens;
    default:
      return [];
  }
}
