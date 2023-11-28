'use client';

import PayForm from '@/app/[address]/_components/pay-form';
import BlockscannerLink from '@/components/BlockscannerLink';
import EnsAvatar from '@/components/ens-avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useConfig from '@/hooks/useConfig';
import { useEns } from '@/hooks/useEns';
import { LuCookie, LuLoader2 } from 'react-icons/lu';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

export default function PayCard({ recipient }: { recipient: string }) {
  const account = useAccount();

  const { initialSellTokenAddress, buyTokenAddress, tokenList } = useConfig();

  const ens = useEns(recipient);

  if (ens.data.name && ens.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 opacity-70">
        <LuLoader2 className="h-12 w-12 animate-spin" />
        Reticulating splines for {recipient}...
      </div>
    );
  }

  if (ens.isFetched && ens.data.name && !ens.data.address) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 opacity-70">
        <LuCookie className="h-12 w-12" />
        Unabled to find address for {recipient}...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-4">
          <EnsAvatar address={recipient} size={60} />
          <div className="space-y-1">
            {ens.data.name ? (
              <>
                <div>{ens.data.name}</div>
                <div className="text-sm font-normal text-foreground">
                  <BlockscannerLink address={ens.data.address} short />
                </div>
              </>
            ) : (
              <div className="font-normal text-foreground">
                <BlockscannerLink
                  address={recipient || ens.data.address}
                  short
                />
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PayForm
          receiver={ens.data.address as Address}
          from={account.address}
          buyToken={buyTokenAddress}
          sellToken={initialSellTokenAddress}
        />
      </CardContent>
    </Card>
  );
}
