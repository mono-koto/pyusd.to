import {
  OrderBookApi,
  OrderQuoteRequest,
  OrderQuoteSideKindBuy,
  OrderQuoteSideKindSell,
} from '@cowprotocol/cow-sdk';
import { Address } from 'wagmi';
import {
  OrderSigningUtils,
  OrderKind,
  SupportedChainId,
} from '@cowprotocol/cow-sdk';
import { WalletClient } from 'wagmi';
import { walletClientToSigner } from './viemEthers';

export interface QuoteOptions {
  chainId: number;
  from: Address;
  receiver: Address;
  sellToken: Address;
  buyToken: Address;
  kind: 'buy' | 'sell';
  amount: string;
}

export interface OrderOptions {
  chainId: number;
  from: Address;
  receiver: Address;
  sellToken: Address;
  buyToken: Address;
  kind: 'buy' | 'sell';
  sellAmount: bigint;
  buyAmount: bigint;
  slippage: bigint;
  feeAmount: bigint;
}

export async function getQuote(quoteOptions: QuoteOptions) {
  const orderBookApi = new OrderBookApi({ chainId: quoteOptions.chainId });
  const request: OrderQuoteRequest = orderQuoteRequest(quoteOptions);
  try {
    return orderBookApi.getQuote(request);
  } catch (e) {
    console.log('e', e);
  }
}

function orderQuoteRequest(quoteOptions: QuoteOptions): OrderQuoteRequest {
  if (quoteOptions.kind == 'buy') {
    return {
      ...quoteOptions,
      kind: OrderQuoteSideKindBuy.BUY,
      buyAmountAfterFee: quoteOptions.amount!,
    };
  } else {
    return {
      ...quoteOptions,
      kind: OrderQuoteSideKindSell.SELL,
      sellAmountBeforeFee: quoteOptions.amount!,
    };
  }
}

export async function signOrder(
  opts: OrderOptions,
  walletClient: WalletClient
) {
  const order = {
    kind: opts.kind == 'buy' ? OrderKind.BUY : OrderKind.SELL,
    receiver: opts.receiver,
    sellToken: opts.sellToken,
    buyToken: opts.buyToken,
    partiallyFillable: false,
    validTo: Math.floor(Date.now() / 1000) + 60, // 1 minute from now
    sellAmount: opts.sellAmount.toString(),
    buyAmount: opts.buyAmount.toString(),
    feeAmount: opts.feeAmount.toString(),
    appData:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
  };

  const signer = walletClientToSigner(walletClient);
  const signedOrder = await OrderSigningUtils.signOrder(
    order,
    SupportedChainId.MAINNET,
    signer
  );
  return signedOrder;
}
