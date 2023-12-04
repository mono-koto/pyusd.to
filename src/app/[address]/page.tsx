'use server';

import { notFound } from 'next/navigation';
import { isAddress } from 'viem';
import { findNickname } from '../_db/nickname-repository';
import PayCard from './_components/pay-card';
import { Suspense } from 'react';
import Loading from '@/components/loading';

export default async function PayPage({
  params,
}: {
  params: { address: string };
}) {
  let recipient = decodeURIComponent(params.address);
  let nickname;
  if (!recipient.endsWith('.eth') && !isAddress(recipient)) {
    const nicknameRecord = await findNickname(recipient);
    if (!nicknameRecord?.address) {
      notFound();
    }
    recipient = nicknameRecord.address.value;
    nickname = nicknameRecord.value;
  }
  return <PayCard addressOrEns={recipient} nickname={nickname} />;
}
