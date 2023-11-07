import { UrlKind, useBlockExplorerUrl } from "@/hooks/useBlockExplorerUrl";
import { shortAddress } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";

type Props = {
  address: string;
  kind?: UrlKind;
  short?: boolean;
  children?: React.ReactNode;
};

export default function BlockscannerLink({
  address,
  kind,
  short,
  children,
}: Props) {
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
        {children || (
          <span className="inline-flex flex-row items-center gap-0.5">
            <span>{displayAddress}</span>
            <ExternalLinkIcon
              height={14}
              className="text-gray-500 inline-block"
            />
          </span>
        )}
      </a>
    );
  } else {
    return <>{displayAddress}</>;
  }
}
