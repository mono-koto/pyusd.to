import { Network, Alchemy } from "alchemy-sdk";
import { useMemo } from "react";
import { useChainId } from "wagmi";

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string;

export const useAlchemyNetwork = () => {
  const chainId = useChainId();
  switch (chainId) {
    case 1:
      return Network.ETH_MAINNET;
    case 5:
      return Network.ETH_GOERLI;
    default:
      return Network.ETH_MAINNET;
  }
};

export const useAlchemy = () => {
  const network = useAlchemyNetwork();
  return useMemo(
    () =>
      new Alchemy({
        apiKey: API_KEY,
        network,
      }),
    [network]
  );
};
