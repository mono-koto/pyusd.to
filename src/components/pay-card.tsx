"use client";

import BlockscannerLink from "@/components/BlockscannerLink";
import EnsAvatar from "@/components/EnsAvatar";
import PayForm from "@/components/PayForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEns } from "@/hooks/useEns";
import { CookieIcon, Loader2 } from "lucide-react";
import { Address } from "viem";
import { useAccount } from "wagmi";

export default function PayPage({ recipient }: { recipient: string }) {
  const account = useAccount();

  const ens = useEns(recipient);

  if (ens.data.name && ens.isLoading) {
    return (
      <div className='flex flex-col items-center justify-center gap-4 opacity-70'>
        <Loader2 className='h-12 w-12 animate-spin' />
        Reticulating splines for {recipient}...
      </div>
    );
  }

  if (ens.isFetched && ens.data.name && !ens.data.address) {
    return (
      <div className='flex flex-col items-center justify-center gap-4 opacity-70'>
        <CookieIcon className='h-12 w-12' />
        Unabled to find address for {recipient}...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex flex-row gap-4 items-center'>
          <EnsAvatar address={recipient} size={60} />
          <div className='space-y-1'>
            {ens.data.name ? (
              <>
                <div>{ens.data.name}</div>
                <div className='text-foreground text-sm font-normal'>
                  <BlockscannerLink address={ens.data.address} />
                </div>
              </>
            ) : (
              <div className='text-foreground font-normal'>
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
          buyToken={{
            address: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",
            decimals: 6,
            name: "PayPal USD",
            symbol: "PYUSD",
          }}
          initialSellToken={{
            address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
          }}
        />
      </CardContent>
    </Card>
  );
}
