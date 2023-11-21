'use client';

import { TokenSelect } from '@/components/pay/TokenSelect';
import { QuoteOptions, useQuote } from '@/hooks/useCowswap';
import {
  OrderQuoteResponse,
  OrderQuoteSideKindBuy,
  OrderQuoteSideKindSell,
} from '@cowprotocol/cow-sdk';
import { Label } from '@radix-ui/react-label';
import { UseQueryResult } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatEther, formatUnits, pad, parseUnits } from 'viem';
import { useBalance } from 'wagmi';
import { Button } from '../ui/button';
import AddressLink from '../AddressLink';
import { TokenDetails } from '@/models';
import {
  UniswapRouteParams,
  UniswapRouteResult,
  useUniswapRoute,
} from '@/hooks/useUniswap';
import { produce } from 'immer';
import { useTokenDetails } from '@/hooks/useTokenDetails';
import { reformatTokenAmount } from '@/lib/format';
import { Skeleton } from '../ui/skeleton';
import { GasFeeDisplay } from './gas-fee-display';

interface PayFormProps {
  sellToken: Address;
  buyToken: Address;
  from?: Address;
  receiver: Address;
}

export default function PayForm({
  sellToken,
  buyToken,
  from,
  receiver,
}: PayFormProps) {
  const initialRouteParams: UniswapRouteParams = {
    recipient: receiver,
    tokenIn: sellToken,
    tokenOut: buyToken,
    amount: BigInt(0),
    tradeType: 'EXACT_INPUT',
  };

  const [sellAmountInput, setSellAmountInput] = useState('');
  const [buyAmountInput, setBuyAmountInput] = useState('');

  const [routeParams, setRouteParams] = useState(initialRouteParams);
  const sellTokenDetails = useTokenDetails(routeParams.tokenIn);
  const buyTokenDetails = useTokenDetails(routeParams.tokenOut);

  const debouncedRouteParams = useDebounce(routeParams, 1000);

  const uniswapRoute = useUniswapRoute({
    ...debouncedRouteParams,
    enabled: true,
  });

  const sellTokenDecimals = sellTokenDetails.data?.decimals;
  const onSellAmountInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSellAmountInput(e.target.value);
      setRouteParams(
        produce((draft: UniswapRouteParams) => {
          if (sellTokenDecimals === undefined) {
            return;
          }
          draft.amount = parseUnits(e.target.value, sellTokenDecimals);
          draft.tradeType = 'EXACT_INPUT';
        })
      );
    },
    [sellTokenDecimals]
  );

  const formatSellAmountInput = useCallback(
    (amount: bigint) => {
      if (sellTokenDecimals === undefined) {
        return '';
      }
      return formatUnits(amount, sellTokenDecimals);
    },
    [sellTokenDecimals]
  );

  const buyTokenDecimals = buyTokenDetails.data?.decimals;
  const onBuyAmountInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBuyAmountInput(e.target.value);
      if (buyTokenDecimals === undefined) {
        return;
      }
      const normalizedValue = e.target.value.trim();
      console.log('normalizedValue', normalizedValue);
      let amount: bigint;
      try {
        amount = parseUnits(normalizedValue, buyTokenDecimals);
      } catch (e) {
        console.error('parseUnits error', e);
        amount = BigInt(0);
        return;
      }
      setRouteParams(
        produce((draft: UniswapRouteParams) => {
          draft.amount = amount;
          draft.tradeType = 'EXACT_OUTPUT';
        })
      );
    },
    [buyTokenDecimals]
  );

  useEffect(() => {
    if (!uniswapRoute.data) {
      return;
    }
    if (uniswapRoute.data?.tradeType === 'EXACT_INPUT') {
      if (buyTokenDecimals !== undefined) {
        setBuyAmountInput(
          reformatTokenAmount(uniswapRoute.data.amountOut, buyTokenDecimals)
        );
      }
    } else {
      if (sellTokenDecimals !== undefined) {
        setSellAmountInput(
          reformatTokenAmount(uniswapRoute.data.amountIn, sellTokenDecimals)
        );
      }
    }
  }, [uniswapRoute.data, buyTokenDecimals, sellTokenDecimals]);

  const handleTokenChange = useCallback((token: TokenDetails) => {
    setRouteParams(
      produce((draft: UniswapRouteParams) => {
        draft.tokenIn = token.address;
      })
    );
  }, []);

  const sellTokenBalance = useBalance({
    token: debouncedRouteParams.tokenIn,
    address: from,
  });

  return (
    <form className="flex flex-col gap-4">
      <div className="border-gray flex flex-col rounded-xl border p-2">
        <Label className="text-sm">You pay</Label>
        <div className="flex flex-row justify-stretch gap-2">
          <input
            placeholder="0.0"
            value={sellAmountInput}
            onChange={onSellAmountInputChange}
            type="number"
            className="h-12 w-full border-none bg-transparent text-4xl focus:outline-none focus:ring-0"
          />
          <TokenSelect onChange={handleTokenChange} defaultToken={sellToken} />
        </div>
        <div className="flex flex-row justify-between gap-2 text-xs">
          <GasFeeDisplay
            isLoading={uniswapRoute.isFetching}
            gasAmount={uniswapRoute.data?.estimatedGasUsed}
            gasPrice={uniswapRoute.data?.gasPriceWei}
          />
          <span className="text-gray-500">
            Your balance: {sellTokenBalance.data?.formatted}
          </span>
        </div>
      </div>
      <div className="border-gray flex flex-col rounded-xl border p-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <Label className="text-sm">
              <AddressLink address={receiver} /> will receive:
            </Label>

            <input
              placeholder="0.0"
              value={buyAmountInput}
              onChange={onBuyAmountInputChange}
              className="h-12 w-full border-none bg-transparent text-4xl focus:outline-none focus:ring-0"
            />
          </div>
          <img
            src={buyTokenDetails.data?.logoURI}
            height={50}
            width={50}
            className="flex-0"
          />
        </div>
      </div>
      <PayButton routeResult={uniswapRoute} />
      {uniswapRoute.isError && (
        <div className="text-sm text-red-500">
          {(uniswapRoute.error as any).message || 'Unknown error'}
        </div>
      )}
    </form>
  );
}

function PayButton({
  routeResult,
}: {
  routeResult: UseQueryResult<UniswapRouteResult>;
}) {
  if (routeResult.isFetching) {
    return (
      <Button className="h-fit" disabled>
        <Loader2 className="h-4 w-4 animate-spin duration-1000" />
        &nbsp; Updating routeResult
      </Button>
    );
  } else {
    return (
      <Button className="h-fit" disabled={!routeResult.isSuccess}>
        <img
          src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg"
          height={20}
          width={20}
        />
        &nbsp; Pay
      </Button>
    );
  }
}
