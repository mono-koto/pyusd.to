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
import { useCallback, useEffect, useState } from 'react';
import { Address, formatUnits, pad, parseUnits } from 'viem';
import { useBalance } from 'wagmi';
import { Button } from './ui/button';
import AddressLink from './AddressLink';
import { TokenDetails } from '@/models';

interface PayFormProps {
  initialSellToken: TokenDetails;
  buyToken: TokenDetails;
  from?: Address;
  receiver: Address;
}

export default function PayForm({
  initialSellToken,
  buyToken,
  from,
  receiver,
}: PayFormProps) {
  const [sellToken, setSellToken] = useState<TokenDetails>(initialSellToken);
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');

  const quoteBaseOptions = {
    sellToken: sellToken.address,
    buyToken: buyToken.address,
    from: from || pad('0x0', { size: 20 }),
    receiver: receiver,
  };

  const [orderOptions, setOrderOptions] = useState<QuoteOptions>({
    ...quoteBaseOptions,
    sellAmountBeforeFee: BigInt(0).toString(),
    kind: OrderQuoteSideKindSell.SELL,
  });

  const debouncedOrderOptions = useDebounce(orderOptions, 1000);
  const quote = useQuote(debouncedOrderOptions);

  const sellTokenBalance = useBalance({
    token: sellToken.address,
    address: from,
  });

  useEffect(() => {
    if (quote.isError) {
      if (quote.data?.quote.kind === (OrderQuoteSideKindBuy.BUY as string)) {
        setSellAmount('');
      } else {
        setBuyAmount('');
      }
    }

    if (!quote.isSuccess) return;

    if (quote.data.quote.kind === (OrderQuoteSideKindBuy.BUY as string)) {
      const sellAmount = Number(
        formatUnits(
          BigInt(quote.data?.quote.sellAmount || ''),
          sellToken.decimals
        )
      ).toFixed(sellToken.decimals < 8 ? 2 : 4);
      setSellAmount(sellAmount);
    } else {
      const buyAmount = Number(
        formatUnits(
          BigInt(quote.data?.quote.buyAmount || ''),
          buyToken.decimals
        )
      ).toFixed(buyToken.decimals < 8 ? 2 : 4);
      setBuyAmount(buyAmount);
    }
  }, [quote, sellToken, buyToken]);

  const onSellAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSellAmount(e.target.value);
      const sellAmount = parseUnits(e.target.value, sellToken.decimals);
      setOrderOptions({
        ...quoteBaseOptions,
        sellAmountBeforeFee: sellAmount.toString(),
        kind: OrderQuoteSideKindSell.SELL,
      });
    },
    [quoteBaseOptions, sellToken.decimals]
  );

  const onBuyAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBuyAmount(e.target.value);
      const buyAmount = parseUnits(e.target.value, buyToken.decimals);
      setOrderOptions({
        ...quoteBaseOptions,
        buyAmountAfterFee: buyAmount.toString(),
        kind: OrderQuoteSideKindBuy.BUY,
      });
    },
    [quoteBaseOptions, buyToken.decimals]
  );

  const handleTokenChange = useCallback((token: TokenDetails) => {
    setOrderOptions({
      ...quoteBaseOptions,
      kind: OrderQuoteSideKindBuy.BUY,
      buyAmountAfterFee: parseUnits(buyAmount, buyToken.decimals).toString(),
    });
    setSellToken(token);
  }, []);

  return (
    <form className="flex flex-col gap-4">
      <div className="border-gray flex flex-col rounded-xl border p-2">
        <Label className="text-sm">You pay</Label>
        <div className="flex flex-row justify-stretch">
          <input
            placeholder="0.0"
            value={sellAmount.toString()}
            onChange={onSellAmountChange}
            className="h-12 w-full border-none bg-transparent text-4xl focus:outline-none focus:ring-0 "
          />
          <TokenSelect onChange={handleTokenChange} />
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
              value={buyAmount}
              onChange={onBuyAmountChange}
              className="h-12 w-full border-none bg-transparent text-4xl focus:outline-none focus:ring-0"
            />
          </div>
          <img
            src={buyToken.logoURI}
            height={50}
            width={50}
            className="flex-0"
          />
        </div>
      </div>
      <div
        className={clsx(
          'flex flex-row items-center gap-2 text-sm opacity-0 transition-opacity duration-200',
          quote.data && 'opacity-100'
        )}
      >
        Fee:{' '}
        {Number(
          formatUnits(
            BigInt(quote.data?.quote.feeAmount || '0'),
            sellToken.decimals
          )
        ).toFixed(sellToken.decimals)}
      </div>
      <PayButton quote={quote} />
      {quote.isError && (
        <div className="text-sm text-red-500">
          {(quote.error as any).message || 'Unknown error'}
        </div>
      )}
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
