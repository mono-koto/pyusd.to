'use server';

import Loading from '@/components/loading';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { isAddress } from 'viem';
import { findNickname } from '../_db/nickname-repository';

const PayCard = dynamic(() => import('@/app/[address]/_components/pay-card'), {
  ssr: false,
  loading: () => <Loading />,
});

export default async function PayPage({
  params,
}: {
  params: { address: string };
}) {
  let recipient = decodeURIComponent(params.address);
  let nickname;
  if (!recipient.endsWith('.eth') && !isAddress(recipient)) {
    const nicknameRecord = await findNickname(recipient);
    console.log(recipient, nicknameRecord);
    if (!nicknameRecord?.address) {
      notFound();
    }
    recipient = nicknameRecord.address.value;
    nickname = nicknameRecord.value;
  }

  return (
    <>
      <PayCard addressOrEns={recipient} nickname={nickname} />
    </>
  );
}
