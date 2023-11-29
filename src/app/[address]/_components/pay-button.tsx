'use client';

import { useAllowance, usePrepareApprove } from '@/hooks/useAllowance';
import { UniswapRouteResult } from '@/hooks/useUniswap';
import { UseQueryResult } from '@tanstack/react-query';
import { LuLoader2 } from 'react-icons/lu';
import { Address, parseUnits } from 'viem';
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

export function PayButton({
  nonZeroAmounts,
  updating,
  routeResult,
  sellTokenDetails,
  onSuccess,
}: {
  updating: boolean;
  nonZeroAmounts: boolean;
  routeResult: UniswapRouteResult | undefined;
  sellTokenDetails: TokenDetails | undefined;
  onSuccess: () => void;
}) {
  const account = useAccount();

  const allowance = useAllowance(
    sellTokenDetails?.address,
    account.address,
    routeResult?.methodParameters.to as Address,
    {
      enabled: !sellTokenDetails?.isNative,
    }
  );

  const balance = useBalance({
    token: sellTokenDetails?.isNative ? undefined : sellTokenDetails?.address,
    address: account.address,
  });

  const amountIn = routeResult
    ? parseUnits(routeResult.amountIn, routeResult.tokenInDetails.decimals)
    : BigInt(0);

  const sufficientBalance = balance.data && balance.data.value > amountIn;

  const needsApproval =
    allowance.data !== undefined &&
    allowance.data < amountIn &&
    !sellTokenDetails?.isNative;

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

  const prepareApprove = usePrepareContractWrite({
    address: sellTokenDetails?.address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [
      (routeResult?.methodParameters.to || account.address) as Address,
      allowanceAmount,
    ],

    enabled:
      account.address &&
      sellTokenDetails &&
      routeResult &&
      sufficientBalance &&
      needsApproval &&
      !sellTokenDetails?.isNative,
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
    allowance.isFetching || balance.isFetching || sendPrepare.isFetching;

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

  if (!sufficientBalance) {
    return (
      <StyledPayButton disabled>
        Insufficient {sellTokenDetails?.symbol} Balance
      </StyledPayButton>
    );
  }

  console.log(prepareApprove);

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
