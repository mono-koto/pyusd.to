'use client';

import { TokenSelect } from '@/app/[address]/_components/token-select';
import { TokenDetails } from '@/models';
import { Label } from '@radix-ui/react-label';
import { useCallback, useState } from 'react';
import { Address } from 'viem';
import AddressLink from '../../../components/AddressLink';
import { GasFeeDisplay } from './gas-fee-display';
import Image from 'next/image';
import Logo from '@/components/logo-svg';
import clsx from 'clsx';
import { cn } from '@/lib/utils';

interface PayFormUIProps {
  nickname?: string;
  receiver: Address;
  initialSellToken: Address;
  sellTokenBalance: string;
  gasFeeIndicator: React.ReactNode;
  buyTokenLogo: string | undefined;
  handleTokenChange: (token: TokenDetails) => void;
  onSellAmountInputChange: (value: string) => void;
  onBuyAmountInputChange: (value: string) => void;
  sellAmountInput: string;
  sellTokenInputDisabled: boolean;
  buyAmountInput: string;
  buyTokenInputDisabled: boolean;
  collapseFields: boolean;
}

export default function PayFormUI({
  nickname,
  receiver,
  initialSellToken,
  sellTokenBalance,
  gasFeeIndicator,
  buyTokenLogo,
  handleTokenChange,
  onSellAmountInputChange,
  onBuyAmountInputChange,
  sellAmountInput,
  sellTokenInputDisabled,
  buyAmountInput,
  buyTokenInputDisabled,
  collapseFields,
}: PayFormUIProps) {
  const handleSellAmountInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onSellAmountInputChange(value);
    },
    [onSellAmountInputChange]
  );

  const handleBuyAmountInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onBuyAmountInputChange(value);
    },
    [onBuyAmountInputChange]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="border-gray flex flex-col rounded-xl border p-2">
        <Label className="text-sm">
          You send
          {collapseFields && (
            <span>
              {' '}
              and <AddressLink address={receiver} /> will receive:
            </span>
          )}
        </Label>
        <div className="flex flex-row justify-stretch gap-2">
          <input
            placeholder="0.0"
            value={sellAmountInput}
            onChange={handleSellAmountInputChange}
            type="number"
            className="h-12 w-full border-none bg-transparent text-4xl focus:outline-none focus:ring-0"
            disabled={sellTokenInputDisabled}
          />
          <TokenSelect
            onChange={handleTokenChange}
            defaultToken={initialSellToken}
          />
        </div>
        <div className="flex flex-row justify-between gap-2 text-xs">
          {gasFeeIndicator}
          <span className="text-gray-500">
            Your balance: {sellTokenBalance}
          </span>
        </div>
      </div>
      {!collapseFields && (
        <>
          <div className="relative h-0">
            <div
              className={cn(
                'absolute left-1/2 z-10 h-fit w-fit -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-muted bg-background p-[7px] shadow-sm transition-all',
                buyTokenInputDisabled || sellTokenInputDisabled
                  ? 'opacity-100'
                  : 'opacity-0 '
              )}
            >
              <Logo className="w-10" animate />
            </div>
          </div>
          <div className="border-gray flex flex-col rounded-xl border p-2">
            <div className="flex flex-row items-center justify-between">
              <div className="flex-1">
                <Label className="text-sm">
                  {nickname ? (
                    <span>
                      &quot;{nickname}&quot; (<AddressLink address={receiver} />
                      )
                    </span>
                  ) : (
                    <AddressLink address={receiver} />
                  )}{' '}
                  will receive:
                </Label>

                <input
                  placeholder="0.0"
                  type="number"
                  value={buyAmountInput}
                  onChange={handleBuyAmountInputChange}
                  className="h-12 w-full border-none bg-transparent text-4xl focus:outline-none focus:ring-0"
                  disabled={buyTokenInputDisabled}
                />
              </div>

              <Image
                src={buyTokenLogo!}
                alt={`Buy Token Logo`}
                height={50}
                width={50}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
