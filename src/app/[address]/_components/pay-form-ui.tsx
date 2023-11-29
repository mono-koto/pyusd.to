'use client';

import { TokenSelect } from '@/app/[address]/_components/token-select';
import { TokenDetails } from '@/models';
import { Label } from '@radix-ui/react-label';
import { useCallback, useState } from 'react';
import { Address } from 'viem';
import AddressLink from '../../../components/AddressLink';
import { GasFeeDisplay } from './gas-fee-display';

interface PayFormUIProps {
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
    <div className="flex flex-col gap-4">
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
        <div className="border-gray flex flex-col rounded-xl border p-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex-1">
              <Label className="text-sm">
                <AddressLink address={receiver} /> will receive:
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
            <img src={buyTokenLogo} height={50} width={50} className="flex-0" />
          </div>
        </div>
      )}
    </div>
  );
}
