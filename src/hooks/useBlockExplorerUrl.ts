import { useNetwork } from "wagmi";

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
  const network = useNetwork();
  const blockExplorer = network.chain?.blockExplorers?.default;
  const url = blockExplorer
    ? `${network.chain?.blockExplorers?.default.url}/${kind}/${id}`
    : undefined;
  return {
    blockExplorer,
    url: url,
  };
};
