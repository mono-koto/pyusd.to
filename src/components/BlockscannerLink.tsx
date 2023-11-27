'use client';
import { UrlKind, useBlockExplorerUrl } from '@/hooks/useBlockExplorerUrl';
import { shortAddress } from '@/lib/utils';
import { LuExternalLink } from 'react-icons/lu';

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
    kind: kind || 'address',
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
            <LuExternalLink
              height={14}
              className="inline-block text-gray-500"
            />
          </span>
        )}
      </a>
    );
  } else {
    return <>{displayAddress}</>;
  }
}
