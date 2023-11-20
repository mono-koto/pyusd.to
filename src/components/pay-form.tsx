'use client';

import { TokenSelect } from '@/components/TokenSelect';
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
import { Address, formatUnits, pad, parseUnits } from 'viem';
import { useBalance } from 'wagmi';
import { Button } from './ui/button';
import AddressLink from './AddressLink';
import { TokenDetails } from '@/models';
import { RouteParams, useUniswapRoute } from '@/hooks/useUniswap';
import { produce } from 'immer';
import { useTokenDetails } from '@/hooks/useTokenDetails';

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
  const initialRouteParams: RouteParams = {
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

  useEffect(() => {
    if (!uniswapRoute.data) {
      return;
    }
    if (uniswapRoute.data?.tradeType === 'EXACT_INPUT') {
      setBuyAmountInput(uniswapRoute.data.amountOut);
    } else {
      setSellAmountInput(uniswapRoute.data.amountIn);
    }
  }, [uniswapRoute.data]);

  const sellTokenDecimals = sellTokenDetails.data?.decimals;
  const onSellAmountInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSellAmountInput(e.target.value);
      setRouteParams(
        produce((draft: RouteParams) => {
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
      setRouteParams(
        produce((draft: RouteParams) => {
          if (buyTokenDecimals === undefined) {
            return;
          }
          draft.amount = parseUnits(e.target.value, buyTokenDecimals);
          draft.tradeType = 'EXACT_OUTPUT';
        })
      );
    },
    [buyTokenDecimals]
  );

  const formatBuyAmountInput = useCallback(
    (amount: bigint) => {
      if (buyTokenDecimals === undefined) {
        return '';
      }
      return formatUnits(amount, buyTokenDecimals);
    },
    [buyTokenDecimals]
  );

  const handleTokenChange = useCallback((token: TokenDetails) => {
    setRouteParams(
      produce((draft: RouteParams) => {
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
        <div className="flex flex-row justify-stretch">
          <input
            placeholder="0.0"
            value={sellAmountInput}
            onChange={onSellAmountInputChange}
            className="h-12 w-full border-none bg-transparent text-4xl focus:outline-none focus:ring-0 "
          />
          <TokenSelect onChange={handleTokenChange} defaultToken={sellToken} />
        </div>
        <div className="text-right text-sm">
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
      <div
        className={clsx(
          'flex flex-row items-center gap-2 text-sm opacity-0 transition-opacity duration-200',
          uniswapRoute.data && 'opacity-100'
        )}
      >
        {uniswapRoute.data && (
          <>
            Gas Price: {formatUnits(uniswapRoute.data.gasPriceWei, 9)} gwei
            <br />
            Quote: {uniswapRoute.data.quoteGasAdjusted}
            <br />
            Input Tax: {uniswapRoute.data?.inputTax}
            <br />
            Input Tax: {uniswapRoute.data?.quoteGasAndPortionAdjusted}
          </>
        )}
      </div>
      {/* <PayButton quote={quote} />
      {quote.isError && (
        <div className="text-sm text-red-500">
          {(quote.error as any).message || 'Unknown error'}
        </div>
      )} */}
    </form>
  );
}

function PayButton({ quote }: { quote: UseQueryResult<OrderQuoteResponse> }) {
  if (quote.isFetching) {
    return (
      <Button className="h-fit" disabled>
        <Loader2 className="h-4 w-4 animate-spin duration-1000" />
        &nbsp; Updating quote
      </Button>
    );
  } else {
    return (
      <Button className="h-fit" disabled={!quote.isSuccess}>
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
