import React from 'react';
import EnsAvatar from '@/components/ens-avatar';
import BlockscannerLink from '@/components/BlockscannerLink';
import { MdPermIdentity } from 'react-icons/md';
import { AddNicknameButton } from './add-nickname-button';
import { Address } from 'viem';
import { ShareButton } from '@/app/[address]/_components/share-button';

interface PayCardTitleProps {
  nickname?: string;
  ensName?: string;
  address: Address;
}

const PayCardTitle: React.FC<PayCardTitleProps> = ({
  nickname,
  ensName,
  address,
}) => {
  const title = nickname || ensName || (
    <span className="text-sm">{address}</span>
  );
  let content;
  if (nickname) {
    content = (
      <>
        <div className="flex flex-row items-center gap-2 text-sm font-normal text-foreground">
          <MdPermIdentity />
          {ensName && <div>{ensName}</div>}
          <BlockscannerLink address={address} short />
        </div>
      </>
    );
  } else {
    content = ensName ? (
      <>
        <div className="flex flex-row items-center gap-2 text-sm font-normal text-foreground">
          <MdPermIdentity />
          <BlockscannerLink address={address} short />
        </div>
      </>
    ) : (
      <div className="text-sm font-normal text-foreground">
        <BlockscannerLink address={address}>
          View on Etherescan
        </BlockscannerLink>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-row flex-wrap items-center justify-stretch gap-4">
      <div className="shrink-0">
        <EnsAvatar address={address} size={60} />
      </div>
      <div className="flex-grow space-y-1">
        <div>{title}</div>
        <div className="font-normal text-foreground">{content}</div>
      </div>
      <AddNicknameButton address={address} />
      <ShareButton ensOrAddress={ensName || address} currentSlug={nickname} />
    </div>
  );
};

export default PayCardTitle;
