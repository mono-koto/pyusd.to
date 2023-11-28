'use server';

import React, { Suspense } from 'react';
import NicknameList from './_components/nickname-list';
import NicknameForm from './_components/nickname-form';
import dynamic from 'next/dynamic';
import { findNickname } from '../_db/nickname-repository';
import { notFound } from 'next/navigation';
import { isAddress } from 'viem';
import { Card, CardContent } from '@/components/ui/card';
import Loading from '@/components/loading';

const PayCard = dynamic(() => import('@/app/[address]/_components/pay-card'), {
  ssr: false,
  loading: () => <Loading />,
});

export default async function NotFound() {
  return (
    <>
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">Not found</div>
        </CardContent>
      </Card>
    </>
  );
}
