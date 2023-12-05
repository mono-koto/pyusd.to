'use client';

import { TokenSelect } from '@/app/[address]/_components/token-select';
import { useAllowance } from '@/hooks/useAllowance';
import { useTokenDetails } from '@/hooks/useTokenDetails';
import { UniswapRouteParams, useUniswapRoute } from '@/hooks/useUniswap';
import { reformatTokenAmount } from '@/lib/format';
import { TokenDetails } from '@/models';
import { Label } from '@radix-ui/react-label';
import { useDebounce } from '@uidotdev/usehooks';
import { produce } from 'immer';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Address, parseUnits } from 'viem';
import { erc20ABI, useBalance, usePrepareContractWrite } from 'wagmi';
import AddressLink from '../../../components/AddressLink';
import { GasFeeDisplay } from './gas-fee-display';
import { PayButton } from './pay-button';
import PayFormUI from './pay-form-ui';
import { set } from 'zod';
import { UseCowSwapQuoteOptions, useCowSwapQuote } from '@/hooks/useCowSwap';

interface PayFormProps {
  nickname?: string;
  sellToken: Address;
  buyToken: Address;
  from?: Address;
  receiver: Address;
}

export default function PayForm({
  nickname,
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

  const sameToken =
    sellTokenDetails.data?.address === buyTokenDetails.data?.address;

  const uniswapRoute = useUniswapRoute({
    ...debouncedRouteParams,
    enabled: !sameToken,
  });

  const kind =
    debouncedRouteParams.tradeType === 'EXACT_INPUT' ? 'sell' : 'buy';
  const cowswapOptions: UseCowSwapQuoteOptions = {
    from: from,
    sellToken: sellTokenDetails.data?.address,
    buyToken: buyTokenDetails.data?.address,
    amount: debouncedRouteParams.amount,
    kind,
    enabled: !sameToken,
    receiver: receiver,
  };

  const cowswapQuote = useCowSwapQuote(cowswapOptions);
  console.log('cowswapQuote', cowswapQuote.status, cowswapQuote.data);

  useEffect(() => {
    if (routeParams.amount === BigInt(0)) {
      setBuyAmountInput('');
      setSellAmountInput('');
    }
  }, [routeParams.amount]);

  const directTransfer = usePrepareContractWrite({
    account: from,
    address: sellTokenDetails.data!.address,
    functionName: 'transfer',
    abi: erc20ABI,
    args: [receiver, debouncedRouteParams.amount],
    enabled: sameToken && sellTokenDetails.data !== undefined,
  });

  const sellTokenDecimals = sellTokenDetails.data?.decimals;

  const onSellAmountInputChange = useCallback(
    (value: string) => {
      setSellAmountInput(value);
      if (sellTokenDecimals === undefined) {
        return;
      }
      let amount: bigint;
      try {
        amount = parseUnits(value, sellTokenDecimals);
      } catch (e) {
        console.error('parseUnits error', e);
        amount = BigInt(0);
        return;
      }
      if (amount === BigInt(0)) {
        setBuyAmountInput('');
      }
      setRouteParams(
        produce((draft: UniswapRouteParams) => {
          draft.amount = amount;
          draft.tradeType = 'EXACT_INPUT';
        })
      );
    },
    [sellTokenDecimals]
  );

  const buyTokenDecimals = buyTokenDetails.data?.decimals;
  const onBuyAmountInputChange = useCallback(
    (value: string) => {
      setBuyAmountInput(value);

      if (buyTokenDecimals === undefined) {
        return;
      }
      let amount: bigint;
      try {
        amount = parseUnits(value, buyTokenDecimals);
      } catch (e) {
        console.error('parseUnits error', e);
        amount = BigInt(0);
        return;
      }
      if (amount === BigInt(0)) {
        setSellAmountInput('');
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
        draft.amount = BigInt(0);
        draft.tradeType = 'EXACT_OUTPUT';
      })
    );
    setSellAmountInput('');
    if (routeParams.tradeType === 'EXACT_INPUT') {
      setBuyAmountInput('');
    }
  }, []);

  const isNative = sellTokenDetails.data?.isNative;
  const sellTokenBalance = useBalance({
    token: isNative ? undefined : sellTokenDetails.data?.address,
    address: from,
    enabled: sellTokenDetails.data !== undefined,
  });

  const resetForm = useCallback(() => {
    setRouteParams(
      produce((draft: UniswapRouteParams) => {
        draft.amount = BigInt(0);
        draft.tradeType = 'EXACT_INPUT';
      })
    );
    sellTokenBalance.refetch();
  }, [
    setSellAmountInput,
    setBuyAmountInput,
    setRouteParams,
    sellTokenBalance,
    uniswapRoute,
  ]);

  const sellTokenInputDisabled =
    uniswapRoute.isFetching &&
    debouncedRouteParams.tradeType === 'EXACT_OUTPUT';
  const buyTokenInputDisabled =
    uniswapRoute.isFetching && debouncedRouteParams.tradeType === 'EXACT_INPUT';

  return (
    <div className="flex flex-col gap-4">
      <PayFormUI
        nickname={nickname}
        receiver={receiver}
        initialSellToken={sellToken}
        sellTokenBalance={reformatTokenAmount(
          sellTokenBalance.data?.formatted || '0',
          sellTokenDetails.data?.decimals || 0
        )}
        gasFeeIndicator={
          <GasFeeDisplay
            isLoading={uniswapRoute.isFetching}
            gasAmount={uniswapRoute.data?.estimatedGasUsed}
            gasPrice={uniswapRoute.data?.gasPriceWei}
          />
        }
        buyTokenLogo={buyTokenDetails.data?.logoURI}
        handleTokenChange={handleTokenChange}
        onSellAmountInputChange={onSellAmountInputChange}
        onBuyAmountInputChange={onBuyAmountInputChange}
        sellAmountInput={sellAmountInput}
        sellTokenInputDisabled={sellTokenInputDisabled}
        buyAmountInput={buyAmountInput}
        buyTokenInputDisabled={buyTokenInputDisabled}
        collapseFields={sameToken}
      />
      <PayButton
        nonZeroAmounts={debouncedRouteParams.amount > BigInt(0)}
        updating={uniswapRoute.isFetching}
        sellTokenDetails={sellTokenDetails.data}
        routeResult={uniswapRoute.data}
        cowswapQuote={cowswapQuote.data}
        onSuccess={resetForm}
      />
    </div>
  );
}
