import { useNetwork, usePublicClient } from "wagmi";

export type UrlKind =
  | "address"
  | "transaction"
  | "token"
  | "contract"
  | "block";

type Options = {
  id: string;
  kind: UrlKind;
};

export const useBlockExplorerUrl = ({ id, kind }: Options) => {
  const chain = usePublicClient().chain;

  const blockExplorer = chain?.blockExplorers?.default;
  const url = blockExplorer
    ? `${chain?.blockExplorers?.default.url}/${kind}/${id}`
    : undefined;
  return {
    blockExplorer,
    url: url,
  };
};
