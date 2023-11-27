'use server';

import React from 'react';
import NicknameList from './_components/nickname-list';
import NicknameForm from './_components/nickname-form';
import dynamic from 'next/dynamic';
import { findNickname } from '../_db/nickname-repository';
import { notFound } from 'next/navigation';
import { isAddress } from 'viem';
import { Card, CardContent } from '@/components/ui/card';

const PayCard = dynamic(
  () => import('@/app/[address]/_components/pay-card'),
  {}
);

export default async function PayPage({
  params,
}: {
  params: { address: string };
}) {
  let recipient = decodeURIComponent(params.address);
  if (!recipient.endsWith('.eth') && !isAddress(recipient)) {
    const nickname = await findNickname(recipient);
    if (!nickname?.address) {
      return notFound();
    }
    recipient = nickname.address.value;
  }

  return (
    <>
      <PayCard recipient={recipient} />

      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            <NicknameForm />
            <NicknameList />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
