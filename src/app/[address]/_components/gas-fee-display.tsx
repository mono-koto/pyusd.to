'use client';

import { reformatTokenAmount } from '@/lib/format';
import { Skeleton } from '../../../components/ui/skeleton';
import { FaEthereum } from 'react-icons/fa6';

interface GasFeeDisplayProps {
  isLoading: boolean;
  gasAmount?: bigint;
  gasPrice?: bigint;
}

export function GasFeeDisplay({
  isLoading,
  gasAmount,
  gasPrice,
}: GasFeeDisplayProps) {
  return (
    <div className="h-4 text-slate-500">
      {(() => {
        if (isLoading) {
          return (
            <span>
              <Skeleton className="inline-block h-4 w-[150px]" />
            </span>
          );
        }
        if (gasAmount === undefined || gasPrice === undefined) {
          return <span>+ network fee</span>;
        }

        return (
          <span className="flex flex-row items-center gap-0.5">
            +{reformatTokenAmount(gasAmount * gasPrice, 18)}
            <FaEthereum />
          </span>
        );
      })()}
    </div>
  );
}
