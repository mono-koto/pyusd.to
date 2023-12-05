import { OrderOptions, QuoteOptions, getQuote, signOrder } from '@/lib/cowswap';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Address, useChainId, useWalletClient } from 'wagmi';
import { useTokenDetails } from './useTokenDetails';
import useConfig from './useConfig';

export interface UseCowSwapQuoteOptions {
  amount: bigint;
  buyToken?: Address;
  sellToken?: Address;
  kind: QuoteOptions['kind'];
  from?: Address;
  receiver?: Address;
  enabled?: boolean;
}

export interface UseCowSwapQuoteResult {
  buyAmount: bigint;
  sellAmount: bigint;
  feeAmount: bigint;
  kind: QuoteOptions['kind'];
}

function isValidQuoteOptions(quoteOptions: UseCowSwapQuoteOptions) {
  return (
    BigInt(quoteOptions.amount) > 0n &&
    quoteOptions.buyToken &&
    quoteOptions.sellToken &&
    quoteOptions.from &&
    quoteOptions.receiver
  );
}

function cowSwapOptions(chainId: number, quoteOptions: UseCowSwapQuoteOptions) {
  return {
    chainId: chainId,
    amount: quoteOptions.amount.toString(),
    buyToken: quoteOptions.buyToken,
    sellToken: quoteOptions.sellToken,
    kind: quoteOptions.kind,
    from: quoteOptions.from,
    receiver: quoteOptions.receiver!,
  };
}

export function useCowSwapQuote(quoteOptions: UseCowSwapQuoteOptions) {
  const config = useConfig();
  const sellTokenDetails = useTokenDetails(quoteOptions.sellToken);
  const wethDetails = useTokenDetails(config.weth);
  quoteOptions.sellToken = sellTokenDetails.data?.isNative
    ? wethDetails.data?.address
    : sellTokenDetails.data?.address;

  const chainId = useChainId();
  const options = cowSwapOptions(chainId, quoteOptions);
  const queryKey = ['cowswap-get-quote', chainId, options];
  const quote = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!isValidQuoteOptions(quoteOptions)) {
        throw 'Invariant: not enabled';
      }
      console.log('Fetching quote from cowswap...');
      const q = await getQuote(
        cowSwapOptions(chainId, quoteOptions) as QuoteOptions
      );
      console.log('CowSwap quote:', q);
      if (!q) {
        throw 'No quote';
      }

      return {
        ...q,
        buyAmount: q.quote.buyAmount,
        sellAmount: q.quote.sellAmount,
        feeAmount: q.quote.feeAmount,
        kind: q.quote.kind,
      };
    },
    staleTime: 1000 * 30,
    enabled:
      Boolean(sellTokenDetails.data) &&
      isValidQuoteOptions(quoteOptions) &&
      quoteOptions.enabled,
  });

  return quote;
}

export function useCowSwapSignMutation(opts: OrderOptions) {
  const client = useWalletClient();
  return useMutation({
    mutationKey: ['cowswap-sign', opts, client],
    mutationFn: async () => {
      return signOrder(opts, client.data!);
    },
  });
}
