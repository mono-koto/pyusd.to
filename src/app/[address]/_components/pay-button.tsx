'use client';

import { useAllowance, usePrepareApprove } from '@/hooks/useAllowance';
import { UniswapRouteResult } from '@/hooks/useUniswap';
import { UseQueryResult } from '@tanstack/react-query';
import { LuLoader2 } from 'react-icons/lu';
import { Address, formatUnits, parseUnits } from 'viem';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi';
import { Button, ButtonProps } from '../../../components/ui/button';
import { TokenDetails } from '@/models';
import { ReactNode, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { reformatTokenAmount } from '@/lib/format';
import BlockscannerLink from '@/components/BlockscannerLink';
import { useConfetti } from '@/hooks/useConfetti';
import { Token, WETH9 } from '@uniswap/sdk-core';
import { useTokenDetails } from '@/hooks/useTokenDetails';
import { useTokens } from '@/hooks/useTokens';
import useConfig from '@/hooks/useConfig';
import { UseCowSwapQuoteResult } from '@/hooks/useCowSwap';

export function PayButton({
  nonZeroAmounts,
  updating,
  routeResult,
  sellTokenDetails,
  cowswapQuote,
  onSuccess,
}: {
  updating: boolean;
  nonZeroAmounts: boolean;
  routeResult: UniswapRouteResult | undefined;
  sellTokenDetails: TokenDetails | undefined;
  cowswapQuote: UseCowSwapQuoteResult | undefined;
  onSuccess: () => void;
}) {
  const { fireConfetti } = useConfetti();
  const account = useAccount();
  const config = useConfig();

  const wethTokenDetails = useTokenDetails(config.weth);

  const sellableTokenDetails: TokenDetails | undefined =
    sellTokenDetails?.isNative && wethTokenDetails.data
      ? wethTokenDetails.data
      : sellTokenDetails;

  const allowance = useAllowance(
    sellableTokenDetails?.address,
    account.address,
    routeResult?.methodParameters.to as Address
  );

  const balance = useBalance({
    token: sellableTokenDetails?.address,
    address: account.address,
    enabled: Boolean(sellTokenDetails),
  });

  const nativeBalance = useBalance({
    address: account.address,
    enabled: Boolean(sellTokenDetails?.isNative),
  });

  const amountIn = routeResult
    ? parseUnits(routeResult.amountIn, routeResult.tokenInDetails.decimals)
    : BigInt(0);

  const sufficientSellableBalance = Boolean(
    balance.data && balance.data.value > amountIn
  );

  const sufficientTotalBalance =
    sufficientSellableBalance ||
    Boolean(
      sellTokenDetails?.isNative &&
        nativeBalance.data &&
        balance.data &&
        nativeBalance.data.value + balance.data.value > amountIn
    );

  const wethToDeposit = sufficientSellableBalance
    ? 0n
    : amountIn - (balance.data?.value || 0n);

  const needsApproval =
    allowance.data !== undefined && allowance.data < amountIn;

  const sendPrepare = usePrepareSendTransaction({
    data: routeResult?.methodParameters.calldata as `0x${string}`,
    to: routeResult?.methodParameters.to,
    value: BigInt(routeResult?.methodParameters.value || 0),
    enabled: !needsApproval,
  });

  const send = useSendTransaction({
    ...sendPrepare.config,
    onMutate: (data) => {
      toast('Initiating transaction...');
    },
    onSuccess: (data) => {
      toast.success(
        <TransactionMessage transactionHash={data.hash}>
          🎉 Transaction success!
        </TransactionMessage>
      );
      allowance.refetch();
      fireConfetti();
      onSuccess();
    },
    onError: (data) => {
      data.message.match('User rejected')
        ? toast.warn('Transaction cancelled')
        : toast.error('Transaction failed');
    },
  });

  const executeSwap = useCallback(() => {
    if (!send.sendTransaction) {
      console.error('Not yet ready to send');
      return;
    }
    send.sendTransaction();
  }, [send.sendTransaction]);

  const allowanceAmount = amountIn;

  const prepareWethDeposit = usePrepareContractWrite({
    address: config.weth,
    abi: [
      {
        constant: false,
        inputs: [],
        name: 'deposit',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
      },
    ],
    functionName: 'deposit',
    args: [],
    value: BigInt(wethToDeposit),
    enabled: sellTokenDetails?.isNative,
  });

  const depositWeth = useContractWrite({
    ...prepareWethDeposit.config,
    onMutate: (data) => {
      toast('Initiating deposit...');
    },
    onSuccess: (data) => {
      toast.success(
        <TransactionMessage transactionHash={data.hash}>
          🎉 Transaction success!
        </TransactionMessage>
      );
    },
    onError: (data) => {
      data.message.match('User rejected')
        ? toast.info('Transaction cancelled')
        : toast.error('Transaction failed');
    },
  });

  const prepareApprove = usePrepareContractWrite({
    address: sellableTokenDetails?.address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [
      (routeResult?.methodParameters.to || account.address) as Address,
      allowanceAmount,
    ],

    enabled:
      account.address &&
      sellableTokenDetails &&
      routeResult &&
      sufficientSellableBalance &&
      needsApproval,
  });

  const setAllowance = useContractWrite({
    ...prepareApprove.config,
    onMutate: (data) => {
      toast('Initiating transaction...');
    },
    onSuccess: (data) => {
      toast.success(
        <TransactionMessage transactionHash={data.hash}>
          🎉 Transaction success!
        </TransactionMessage>
      );
    },
    onError: (data) => {
      data.message.match('User rejected')
        ? toast.info('Transaction cancelled')
        : toast.error('Transaction failed');
    },
  });

  const fetching =
    allowance.isFetching ||
    balance.isFetching ||
    sendPrepare.isFetching ||
    prepareWethDeposit.isFetching;

  if (updating || fetching) {
    return (
      <StyledPayButton disabled>
        <LuLoader2 className="h-4 w-4 animate-spin duration-1000" />
        &nbsp; Updating
      </StyledPayButton>
    );
  }

  if (!nonZeroAmounts) {
    return <StyledPayButton disabled>Please enter an amount</StyledPayButton>;
  }

  if (!sufficientSellableBalance) {
    if (sufficientTotalBalance) {
      return (
        <StyledPayButton
          onClick={() => depositWeth.write && depositWeth.write()}
        >
          Wrap {reformatTokenAmount(formatUnits(wethToDeposit, 18), 18)} ETH
        </StyledPayButton>
      );
    }

    return (
      <StyledPayButton disabled>
        Insufficient {sellTokenDetails?.symbol} Balance
      </StyledPayButton>
    );
  }

  if (needsApproval) {
    return (
      <StyledPayButton
        onClick={() => {
          setAllowance.write && setAllowance.write();
        }}
        disabled={!prepareApprove.isSuccess}
      >
        Approve {sellTokenDetails?.symbol}
      </StyledPayButton>
    );
  }

  if (send.isLoading) {
    return (
      <StyledPayButton disabled>
        <LuLoader2 className="h-4 w-4 animate-spin duration-1000" />
        &nbsp; Paying
      </StyledPayButton>
    );
  }

  if (!routeResult) {
    return <StyledPayButton disabled>Unable to swap</StyledPayButton>;
  }

  return (
    <StyledPayButton disabled={!sendPrepare.isSuccess} onClick={executeSwap}>
      <img
        src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg"
        height={20}
        width={20}
      />
      &nbsp; Send{' '}
      {reformatTokenAmount(
        routeResult.amountOut,
        routeResult.tokenOutDetails.decimals
      )}{' '}
      PYUSD
    </StyledPayButton>
  );
}

function StyledPayButton(props?: ButtonProps) {
  return <Button className="h-fit rounded-xl py-4 text-lg" {...props} />;
}

function TransactionMessage({
  children,
  transactionHash,
}: {
  children: ReactNode;
  transactionHash?: string;
}) {
  return (
    <div>
      <div>{children}</div>
      {transactionHash && (
        <BlockscannerLink kind="transaction" address={transactionHash} />
      )}
    </div>
  );
}
