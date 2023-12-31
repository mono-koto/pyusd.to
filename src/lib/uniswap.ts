import {
  AlphaRouter,
  AlphaRouterConfig,
  OnChainQuoteProvider,
  SwapOptionsSwapRouter02,
  SwapRoute,
  SwapType,
  UniswapMulticallProvider,
} from '@uniswap/smart-order-router';
import {
  TradeType,
  CurrencyAmount,
  Percent,
  ChainId,
  Currency,
} from '@uniswap/sdk-core';
import { ethers } from 'ethers';
import { Address } from 'viem';
import { Protocol } from '@uniswap/router-sdk';
import { getEthersProvider } from './viemEthers';
import { localhost } from 'viem/chains';

type TokenPermit = {
  v: 0 | 1 | 27 | 28;
  r: string;
  s: string;
} & (
  | {
      amount: string;
      deadline: string;
    }
  | {
      nonce: string;
      expiry: string;
    }
);

type RouteOptions = {
  router: AlphaRouter;
  recipient: Address;
  tokenIn: Currency;
  tokenOut: Currency;
  amount: bigint;
  tradeType: TradeType;
  inputTokenPermit?: TokenPermit;
};
export async function generateRoute({
  router,
  recipient,
  tokenIn,
  tokenOut,
  amount,
  tradeType,
  inputTokenPermit,
}: RouteOptions): Promise<SwapRoute | null> {
  const options: SwapOptionsSwapRouter02 = {
    recipient: recipient,
    slippageTolerance: new Percent(50, 10_000),
    deadline: Math.floor(Date.now() / 1000 + 1800),
    type: SwapType.SWAP_ROUTER_02,
    inputTokenPermit,
  };

  const routerOptions: Partial<AlphaRouterConfig> = {
    v2PoolSelection: {
      topN: 1,
      topNDirectSwaps: 1,
      topNTokenInOut: 1,
      topNSecondHop: 0,
      topNWithEachBaseToken: 1,
      topNWithBaseToken: 1,
    },
    v3PoolSelection: {
      topN: 1,
      topNDirectSwaps: 1,
      topNTokenInOut: 1,
      topNSecondHop: 0,
      topNWithEachBaseToken: 1,
      topNWithBaseToken: 1,
    },
    maxSwapsPerPath: 3,
    maxSplits: 1,
    distributionPercent: 100,
    writeToCachedRoutes: false,
    useCachedRoutes: false, // TODO no route caching provider yet
    optimisticCachedRoutes: false,
    protocols: [Protocol.V3],
  };

  if (tradeType === TradeType.EXACT_INPUT) {
    return await router.route(
      CurrencyAmount.fromRawAmount(tokenIn, amount.toString()),
      tokenOut,
      tradeType,
      options,
      routerOptions
    );
  } else {
    return await router.route(
      CurrencyAmount.fromRawAmount(tokenOut, amount.toString()),
      tokenIn,
      tradeType,
      options,
      routerOptions
    );
  }
}

// For tweaking the quote provider behavior
export function onChainQuoteProvider(
  chainId: ChainId,
  provider: ethers.providers.BaseProvider
) {
  const multicall2Provider = new UniswapMulticallProvider(
    chainId,
    getEthersProvider({ chainId }),
    375_000
  );
  return new OnChainQuoteProvider(
    chainId,
    provider,
    multicall2Provider,
    {
      retries: 2,
      minTimeout: 100,
      maxTimeout: 1000,
    },
    {
      multicallChunk: 210,
      gasLimitPerCall: 705_000,
      quoteMinSuccessRate: 0.15,
    },
    {
      gasLimitOverride: 2_000_000,
      multicallChunk: 70,
    }
  );
}
