import { useQuery } from "@tanstack/react-query";
import { useAlchemy } from "./useAlchemy";

type UseTokenBalancesOptions = {
  tokenAddresses?: string[];
  ownerAddress?: string;
};

export const useTokenBalances = ({
  tokenAddresses,
  ownerAddress,
}: UseTokenBalancesOptions) => {
  const alchemy = useAlchemy();
  return useQuery({
    queryKey: [
      "alchemy-token-balances",
      alchemy.config.network,
      tokenAddresses,
      ownerAddress,
    ],
    queryFn: async () => {
      const result = await alchemy.core.getTokenBalances(
        ownerAddress!,
        tokenAddresses
      );
      return result.tokenBalances.reduce((acc, tokenBalance) => {
        acc[tokenBalance.contractAddress] = tokenBalance.tokenBalance;
        return acc;
      }, {} as Record<string, string | null>);
    },
    enabled: Boolean(ownerAddress),
  });
};
