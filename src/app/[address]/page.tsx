'use server';

import { notFound } from 'next/navigation';
import { isAddress } from 'viem';
import { findNickname } from '../_db/nickname-repository';
import PayCard from './_components/pay-card';
import { ResolvingMetadata, Metadata } from 'next';
import LayoutWrapper from '@/components/layout-wrapper';
import MainContent from '@/components/main-content';

type Props = {
  params: { address: string };
};

async function getRecipientAndNickname(address: string) {
  let recipient = decodeURIComponent(address);
  let nickname;
  if (!recipient.endsWith('.eth') && !isAddress(recipient)) {
    const nicknameRecord = await findNickname(recipient);
    if (!nicknameRecord?.address) {
      notFound();
    }
    recipient = nicknameRecord.address.value;
    nickname = nicknameRecord.value;
  }
  return { recipient, nickname };
}

export default async function PayPage({ params }: Props) {
  const { recipient, nickname } = await getRecipientAndNickname(params.address);
  return (
    <MainContent>
      <PayCard addressOrEns={recipient} nickname={nickname} />
    </MainContent>
  );
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { recipient, nickname } = await getRecipientAndNickname(params.address);

  return {
    title: nickname || recipient,
    description: nickname
      ? `Send PYUSD to ${nickname} (${recipient})`
      : `Send PYUSD to ${recipient}`,
  };
}
