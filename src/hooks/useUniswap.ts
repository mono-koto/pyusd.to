import { Token, TradeType } from '@uniswap/sdk-core';
import {
  AlphaRouter,
  OnChainQuoteProvider,
  SwapRoute,
  UniswapMulticallProvider,
} from '@uniswap/smart-order-router';
import {
  Address,
  useChainId,
  useNetwork,
  usePrepareSendTransaction,
  usePublicClient,
  useSendTransaction,
  useWalletClient,
} from 'wagmi';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';

import { generateRoute, onChainQuoteProvider } from '@/lib/uniswap';
import { useQuery } from '@tanstack/react-query';
import { useEthersSigner } from './useEthersProvider';
import { useTokenDetails } from './useTokenDetails';
import { useMemo } from 'react';
import { getEthersProvider, walletClientToSigner } from '@/lib/viemEthers';
import {
  HttpTransport,
  Transport,
  createWalletClient,
  custom,
  http,
  publicActions,
} from 'viem';
import chains from 'viem/chains';

const UNISWAP_V3_SWAP_ROUTER_ADDRESS: Address =
  '0xE592427A0AEce92De3Edee1F18E0157C05861564';

export interface RouteParams {
  recipient: Address;
  tokenIn: Address;
  tokenOut: Address;
  amount: bigint;
  tradeType: 'EXACT_INPUT' | 'EXACT_OUTPUT';
  enabled?: boolean;
}

function useUniswapToken(address: Address) {
  const { data: token, status } = useTokenDetails(address);
  const data =
    token &&
    new Token(
      token.chainId,
      token.address,
      token.decimals,
      token.symbol,
      token.name
    );
  return { data, status };
}

export function useRouter() {
  const chainId = useChainId();
  // const { chain } = useNetwork();
  const { data: currentWalletClient } = useWalletClient({ chainId });
  const publicClient = usePublicClient({ chainId });

  const walletClient = useMemo(() => {
    if (currentWalletClient) {
      return currentWalletClient;
    } else {
      const privateKey = generatePrivateKey();
      const account = privateKeyToAccount(privateKey);
      return createWalletClient({
        account,
        chain: publicClient.chain,
        transport: custom(publicClient),
      });
    }
  }, [currentWalletClient, publicClient]);

  return useMemo(() => {
    const provider = getEthersProvider({ chainId });
    const signer = walletClientToSigner(walletClient);
    return new AlphaRouter({
      chainId,
      provider: signer.provider,
      onChainQuoteProvider: onChainQuoteProvider(chainId, provider),
    });
  }, [chainId, walletClient]);
}

export function useUniswapRoute({
  recipient,
  tokenIn,
  tokenOut,
  amount,
  tradeType,
  enabled,
}: RouteParams) {
  const chainId = useChainId();
  const tokenInQuery = useUniswapToken(tokenIn);
  const tokenOutQuery = useUniswapToken(tokenOut);

  const uniswapTradeType =
    tradeType === 'EXACT_INPUT'
      ? TradeType.EXACT_INPUT
      : TradeType.EXACT_OUTPUT;

  console.log('useUniswapRoute');
  const router = useRouter();
  // console.log(router);

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
    queryFn: async () => {
      console.log(router, tokenInQuery.data, tokenOutQuery.data);
      if (router && tokenInQuery.data && tokenOutQuery.data) {
        console.log('generating route');
        const route = await generateRoute({
          router,
          recipient,
          tokenIn: tokenInQuery.data,
          amount,
          tradeType: uniswapTradeType,
          tokenOut: tokenOutQuery.data,
        });
        if (!route) {
          throw new Error('No route found');
        }
        console.log('route found');

        return {
          tradeType:
            route.trade.tradeType === TradeType.EXACT_INPUT
              ? 'EXACT_INPUT'
              : 'EXACT_OUTPUT',
          methodParameters: route.methodParameters,
          amountIn: route.trade.inputAmount.toExact(),
          amountOut: route.trade.outputAmount.toExact(),
          inputTax: route.trade.inputTax.toFixed(4),
          quoteGasAdjusted: route.quoteGasAdjusted.toExact(),
          quoteGasAndPortionAdjusted:
            route.quoteGasAndPortionAdjusted?.toExact(),
          gasPriceWei: route.gasPriceWei.toBigInt(),
        };
      }
    },
    staleTime: 1000 * 30,
    enabled: Boolean(tokenInQuery.data && tokenOutQuery.data && enabled),
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
