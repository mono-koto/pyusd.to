'use client';

import PayForm from './pay-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useConfig from '@/hooks/useConfig';
import { useEns } from '@/hooks/useEns';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
import NotFound from '../not-found';
import PayCardTitle from './pay-card-title';

interface PayCardProps {
  addressOrEns: string;
  nickname?: string;
}

export default function PayCard({ addressOrEns, nickname }: PayCardProps) {
  const account = useAccount();
  const { initialSellTokenAddress, buyTokenAddress } = useConfig();

  const ens = useEns(addressOrEns, { suspense: true });

  const notFound =
    !nickname && ens.isSuccess && ens.data.name && !ens.data.address;
  if (notFound) {
    return (
      <NotFound>
        Address not found for <strong>{ens.data.name}</strong>.
        <br />
      </NotFound>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-4">
          <PayCardTitle
            nickname={nickname}
            ensName={ens.data.name || undefined}
            address={ens.data.address}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PayForm
          nickname={nickname}
          receiver={ens.data.address as Address}
          from={account.address}
          buyToken={buyTokenAddress}
          sellToken={initialSellTokenAddress}
        />
      </CardContent>
    </Card>
  );
}
