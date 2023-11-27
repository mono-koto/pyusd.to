'use server';

import React from 'react';
import NicknameList from './nickname-list';
import NicknameForm from './nickname-form';
import dynamic from 'next/dynamic';
import { findNickname } from '../_db/nickname-repository';
import { notFound } from 'next/navigation';
import { isAddress } from 'viem';
import { Card, CardContent } from '@/components/ui/card';

const PayCard = dynamic(() => import('@/components/pay/pay-card'), {});

export default async function PayPage({
  params,
}: {
  params: { address: string };
}) {
  let recipient = params.address;
  if (!params.address.endsWith('.eth') && !isAddress(params.address)) {
    console.log(params.address);
    console.log(decodeURIComponent(params.address));
    const nickname = await findNickname(decodeURIComponent(params.address));
    console.log(nickname);
    if (!nickname?.address) {
      return notFound();
    }
    recipient = nickname.address.value;
  }

  return (
    <>
      <PayCard recipient={recipient} />

      <Card>
        <NicknameForm />

        <CardContent>
          <div>
            <NicknameList />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
