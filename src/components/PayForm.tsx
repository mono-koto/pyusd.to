"use client";

import { TokenSelect } from "@/components/TokenSelect";
import { QuoteOptions, useQuote } from "@/hooks/useCowswap";
import {
  OrderQuoteResponse,
  OrderQuoteSideKindBuy,
  OrderQuoteSideKindSell,
} from "@cowprotocol/cow-sdk";
import { Label } from "@radix-ui/react-label";
import { UseQueryResult } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Address, formatUnits, pad, parseUnits } from "viem";
import { useBalance } from "wagmi";
import { Button } from "./ui/button";
import AddressLink from "./AddressLink";
import { TokenListToken } from "@/hooks/useTokens";

interface Token {
  address: Address;
  decimals: number;
  name: string;
  symbol: string;
}

interface PayFormProps {
  initialSellToken: Token;
  buyToken: Token;
  from?: Address;
  receiver: Address;
}

export default function PayForm({
  initialSellToken,
  buyToken,
  from,
  receiver,
}: PayFormProps) {
  const [sellToken, setSellToken] = useState<Token>(initialSellToken);
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");

  const quoteBaseOptions = {
    sellToken: sellToken.address,
    buyToken: buyToken.address,
    from: from || pad("0x0", { size: 20 }),
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
    if (!quote.isSuccess) return;

    if (quote.data.quote.kind === (OrderQuoteSideKindBuy.BUY as string)) {
      const sellAmount = Number(
        formatUnits(
          BigInt(quote.data?.quote.sellAmount || ""),
          sellToken.decimals
        )
      ).toFixed(sellToken.decimals < 8 ? 2 : 4);
      setSellAmount(sellAmount);
    } else {
      const buyAmount = Number(
        formatUnits(
          BigInt(quote.data?.quote.buyAmount || ""),
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

  const handleTokenChange = useCallback((token: TokenListToken) => {
    // setOrderOptions({
    //   ...quoteBaseOptions,
    //   kind: OrderQuoteSideKindBuy.BUY,
    //   buyAmountAfterFee: parseUnits(buyAmount, buyToken.decimals).toString(),
    // });
    setSellToken({
      address: token.address as Address,
      decimals: token.decimals,
      name: token.name,
      symbol: token.symbol,
    });
  }, []);

  return (
    <form className='flex flex-col gap-4'>
      <div className='rounded-xl border-gray border p-2 flex flex-col'>
        <Label className='text-sm'>You pay</Label>
        <div className='flex flex-row justify-stretch'>
          <input
            placeholder='0.0'
            value={sellAmount.toString()}
            onChange={onSellAmountChange}
            className='text-4xl h-12 border-none focus:ring-0 focus:outline-none bg-transparent'
          />
          <TokenSelect onChange={handleTokenChange} />
        </div>
        <div className='text-sm text-right'>
          <span className='text-gray-500'>
            Your balance: {sellTokenBalance.data?.formatted}
          </span>
        </div>
      </div>

      <div className='rounded-xl border-gray border p-2 flex flex-col'>
        <div className='flex flex-row justify-between items-center'>
          <div>
            <Label className='text-sm'>
              <AddressLink address={receiver} /> will receive:
            </Label>

            <input
              placeholder='0.0'
              value={buyAmount}
              onChange={onBuyAmountChange}
              className='text-4xl h-12 border-none focus:ring-0 focus:outline-none bg-transparent'
            />
          </div>
          <img
            src='https://www.paypalobjects.com/devdoc/coin-PYUSD.svg'
            height={50}
            width={50}
            className='mr-2'
          />
        </div>
      </div>
      <div
        className={clsx(
          "transition-opacity duration-200 flex flex-row gap-2 text-sm items-center opacity-0",
          quote.data && "opacity-100"
        )}
      >
        Fee:{" "}
        {Number(
          formatUnits(
            BigInt(quote.data?.quote.feeAmount || "0"),
            sellToken.decimals
          )
        ).toFixed(2)}
        {/* <Loader2 className="animate-spin duration-1000 w-4 h-4" />
        <span>Updating quote&hellip;</span> */}
      </div>

      <PayButton quote={quote} />
    </form>
  );
}

function PayButton({ quote }: { quote: UseQueryResult<OrderQuoteResponse> }) {
  if (quote.isFetching) {
    return (
      <Button className='h-fit' disabled>
        <Loader2 className='animate-spin duration-1000 w-4 h-4' />
        &nbsp; Updating quote
      </Button>
    );
  } else {
    return (
      <Button className='h-fit' disabled={!quote.isSuccess}>
        <img
          src='https://www.paypalobjects.com/devdoc/coin-PYUSD.svg'
          height={20}
          width={20}
        />
        &nbsp; Pay
      </Button>
    );
  }
}
