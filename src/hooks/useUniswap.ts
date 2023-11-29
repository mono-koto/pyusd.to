import { Ether, NativeCurrency, Token, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter, SwapRoute } from '@uniswap/smart-order-router';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import {
  Address,
  PublicClient,
  useChainId,
  usePrepareSendTransaction,
  usePublicClient,
  useSendTransaction,
  useWalletClient,
} from 'wagmi';

import { generateRoute, onChainQuoteProvider } from '@/lib/uniswap';
import { getEthersProvider, walletClientToSigner } from '@/lib/viemEthers';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createWalletClient, custom, formatUnits } from 'viem';
import { useTokenDetails } from './useTokenDetails';
import { TokenDetails } from '@/models';
import { localhost } from 'viem/chains';

const UNISWAP_V3_SWAP_ROUTER_ADDRESS: Address =
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';

export interface UniswapRouteParams {
  recipient: Address;
  tokenIn: Address;
  tokenOut: Address;
  amount: bigint;
  tradeType: 'EXACT_INPUT' | 'EXACT_OUTPUT';
  enabled?: boolean;
}

export interface UniswapRouteResult {
  amountIn: string;
  amountOut: string;
  estimatedGasUsed: bigint;
  estimatedGasUsedQuoteToken: string;
  estimatedGasUsedUSD: string;
  gasPriceWei: bigint;
  inputTax: string;
  methodParameters: {
    calldata: string;
    to: string;
    value: string;
  };
  quoteGasAdjusted: string;
  quoteGasAndPortionAdjusted: string | undefined;
  tokenInDetails: TokenDetails;
  tokenOutDetails: TokenDetails;
  tradeType: 'EXACT_INPUT' | 'EXACT_OUTPUT';
}

function uniswapToken(tokenDetails: TokenDetails) {
  if (tokenDetails.isNative) {
    return Ether.onChain(tokenDetails.chainId);
  } else {
    return new Token(
      tokenDetails.chainId,
      tokenDetails.address,
      tokenDetails.decimals,
      tokenDetails.symbol,
      tokenDetails.name
    );
  }
}

function temporaryWalletClient(publicClient: PublicClient) {
  const account = privateKeyToAccount(generatePrivateKey());
  return createWalletClient({
    account,
    chain: publicClient.chain,
    transport: custom(publicClient),
  });
}

export function useRouter() {
  const chainId = useChainId();
  const { data: currentWalletClient } = useWalletClient({ chainId });
  const publicClient = usePublicClient({ chainId });

  return useMemo(() => {
    const walletClient =
      currentWalletClient || temporaryWalletClient(publicClient);
    const provider = getEthersProvider({ chainId });
    const signer = walletClientToSigner(walletClient);
    // Trick Uniswap into thinking that localhost is mainnet
    const uniswapChainId = (chainId as number) === localhost.id ? 1 : chainId;
    return new AlphaRouter({
      chainId: uniswapChainId,
      provider: signer.provider,
      onChainQuoteProvider: onChainQuoteProvider(uniswapChainId, provider),
    });
  }, [chainId, currentWalletClient, publicClient]);
}

/***
 * This hook is used to generate a route for a Uniswap swap.
 * It will return a route object that can be used to execute the swap.
 */
export function useUniswapRoute({
  recipient,
  tokenIn,
  tokenOut,
  amount,
  tradeType,
  enabled,
}: UniswapRouteParams) {
  const chainId = useChainId();
  const tokenInQuery = useTokenDetails(tokenIn);
  const tokenOutQuery = useTokenDetails(tokenOut);

  const uniswapTradeType =
    tradeType === 'EXACT_INPUT'
      ? TradeType.EXACT_INPUT
      : TradeType.EXACT_OUTPUT;

  const router = useRouter();

  return useQuery({
    queryKey: [
      'uniswap-route',
      chainId,
      recipient,
      tokenIn,
      tokenOut,
      amount.toString(),
      uniswapTradeType,
    ],
    queryFn: async (): Promise<UniswapRouteResult> => {
      if (amount === BigInt(0)) {
        throw new Error('Amount must be greater than 0');
      }
      if (router && tokenInQuery.data && tokenOutQuery.data) {
        console.log('generating route');
        const route = await generateRoute({
          amount,
          tokenIn: uniswapToken(tokenInQuery.data),
          tokenOut: uniswapToken(tokenOutQuery.data),
          tradeType: uniswapTradeType,
          recipient,
          router,
        });
        if (!route) {
          throw new Error(
            `No route returned found for ${tokenIn} ${tokenOut} ${tradeType} ${amount}`
          );
        }

        if (route.route.length === 0) {
          throw new Error(
            `No routes found for ${tokenIn} ${tokenOut} ${tradeType} ${amount}`
          );
        }

        if (!route.methodParameters) {
          throw new Error('No method parameters in result');
        }
        console.log('Route found', route.route);

        return {
          tradeType:
            route.trade.tradeType === TradeType.EXACT_INPUT
              ? 'EXACT_INPUT'
              : 'EXACT_OUTPUT',
          methodParameters: route.methodParameters,
          tokenInDetails: tokenInQuery.data!,
          tokenOutDetails: tokenInQuery.data!,
          amountIn: route.trade.inputAmount.toExact(),
          amountOut: route.trade.outputAmount.toExact(),
          inputTax: route.trade.inputTax.toFixed(4),
          quoteGasAdjusted: route.quoteGasAdjusted.toExact(),
          quoteGasAndPortionAdjusted:
            route.quoteGasAndPortionAdjusted?.toExact(),
          gasPriceWei: route.gasPriceWei.toBigInt(),
          estimatedGasUsed: route.estimatedGasUsed.toBigInt(),

          estimatedGasUsedQuoteToken:
            route?.estimatedGasUsedQuoteToken?.toExact(),
          estimatedGasUsedUSD: route?.estimatedGasUsedUSD?.toExact(),
        };
      } else {
        throw new Error('Missing router or token data');
      }
    },
    retry: false,
    staleTime: 1000 * 30,
    enabled:
      amount > 0 && Boolean(tokenInQuery.data && tokenOutQuery.data && enabled),
  });
}

export function usePrepareUniswapExecuteRoute(route: SwapRoute) {
  return usePrepareSendTransaction({
    data: route.methodParameters?.calldata as `0x${string}` | undefined,
    to: UNISWAP_V3_SWAP_ROUTER_ADDRESS,
    value: BigInt(route?.methodParameters?.value || 0),
  });
}

export function useUniswapExecuteRoute(
  config: ReturnType<typeof usePrepareUniswapExecuteRoute>['config']
) {
  return useSendTransaction(config);
}
