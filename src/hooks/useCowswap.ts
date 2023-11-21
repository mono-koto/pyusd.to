import {
  OrderBookApi,
  OrderQuoteRequest,
  OrderQuoteSideKindBuy,
  OrderQuoteSideKindSell,
} from '@cowprotocol/cow-sdk';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Address, useChainId } from 'wagmi';

export interface QuoteOptions {
  from: Address;
  receiver: Address;
  sellToken: Address;
  buyToken: Address;
  kind: 'buy' | 'sell';
  sellAmountBeforeFee?: string;
  buyAmountAfterFee?: string;
}

function validQuoteRequest(quoteOptions: QuoteOptions): boolean {
  if (!quoteOptions?.sellToken || !quoteOptions?.buyToken) {
    return false;
  }

  if (quoteOptions.kind == 'buy') {
    const amount = quoteOptions.buyAmountAfterFee;
    return Boolean(amount && Number(amount) !== 0);
  } else if (quoteOptions.kind == 'sell') {
    const amount = quoteOptions.sellAmountBeforeFee;
    return Boolean(amount && Number(amount) !== 0);
  } else {
    return false;
  }
}

function orderQuoteRequest(quoteOptions: QuoteOptions): OrderQuoteRequest {
  if (quoteOptions.kind == 'buy') {
    return {
      ...quoteOptions,
      kind: OrderQuoteSideKindBuy.BUY,
      buyAmountAfterFee: quoteOptions.buyAmountAfterFee!,
    };
  } else {
    return {
      ...quoteOptions,
      kind: OrderQuoteSideKindSell.SELL,
      sellAmountBeforeFee: quoteOptions.sellAmountBeforeFee!,
    };
  }
}

export function useQuote(quoteOptions: QuoteOptions) {
  const chainId = useChainId();
  const orderBookApi = useMemo(
    () => new OrderBookApi({ chainId: chainId }),
    [chainId]
  );

  const queryKey = ['cowswap-get-quote', chainId, quoteOptions];

  const quote = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      // console.log('quoteOptions', quoteOptions);
      // console.log('chain', orderBookApi.context.chainId);
      const request = orderQuoteRequest(quoteOptions);
      try {
        return await orderBookApi.getQuote(request);
      } catch (error: any) {
        const e = {
          name: error.body?.errorType || 'Quote Error',
          message: error.body?.description,
        };
        console.error(e);
        throw e;
      }
    },
    staleTime: 1000 * 50,
    enabled: false,
    retry: 0,
  });

  // if (quote.isSuccess) {
  //   console.log('quote', quote.data);
  // }

  return quote;
}
