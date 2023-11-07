import { UrlKind, useBlockExplorerUrl } from "@/hooks/useBlockExplorerUrl";
import { shortAddress } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

type Props = {
  address: string;
  kind?: UrlKind;
  short?: boolean;
};

export default function BlockscannerLink({ address, kind, short }: Props) {
  const { url, blockExplorer } = useBlockExplorerUrl({
    id: address,
    kind: kind || "address",
  });

  const displayAddress = short ? shortAddress(address) : address;

  if (url) {
    return (
      <a
        href={url}
        title={`View on ${blockExplorer?.name}`}
        className="hover:underline"
      >
        <span className="flex flex-row items-center gap-0.5">
          <span>{displayAddress}</span>
          <ExternalLink height={14} className="text-gray-500 inline-block" />
        </span>
      </a>
    );
  } else {
    return <>{displayAddress}</>;
  }
}
