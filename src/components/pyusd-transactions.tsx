'use server';
import { Address, createPublicClient, http } from 'viem';
import BlockscannerLink from './BlockscannerLink';
import { useEns } from '@/hooks/useEns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { tokenSwaps } from '@/app/actions';
import { coreConfig } from '@/config';
import { mainnet } from 'wagmi';

type Props = {
  address: Address;
};

export default async function Swaps({ address }: Props) {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(coreConfig.alchemyAPIKey),
  });
  const swaps = await tokenSwaps(client, address);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent swaps to PYUSD</CardTitle>
      </CardHeader>
      <CardContent>
        {swaps.map((swap, i) => (
          <div key={i} className="flex flex-row items-center gap-2">
            <BlockscannerLink address={swap.to} short />
            <div className="text-sm font-normal text-foreground">
              {swap.value.toString()}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
