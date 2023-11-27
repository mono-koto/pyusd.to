'use client';

import { reformatTokenAmount } from '@/lib/format';
import { Skeleton } from '../../../components/ui/skeleton';

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
          <span className="">
            +{reformatTokenAmount(gasAmount * gasPrice, 18)}
            <img src={'/eth-mini.svg'} className="inline-block h-4 w-4" />
          </span>
        );
      })()}
    </div>
  );
}
