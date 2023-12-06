'use client';

import BlockscannerLink from '@/components/BlockscannerLink';
import { useAllowance } from '@/hooks/useAllowance';
import { useConfetti } from '@/hooks/useConfetti';
import { UniswapRouteResult } from '@/hooks/useUniswap';
import { reformatTokenAmount } from '@/lib/format';
import { TokenDetails } from '@/models';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ReactNode, useCallback, useEffect } from 'react';
import { LuLoader2 } from 'react-icons/lu';
import { toast } from 'react-toastify';
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
  const { fireConfetti } = useConfetti();
  const account = useAccount();
  const connectModal = useConnectModal();

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
    onSettled: (data) => {
      balance.refetch();
    },
    onError: (data) => {
      data.message.match('User rejected')
        ? toast.warn('Transaction cancelled')
        : toast.error('Transaction failed');
    },
  });

  const watchSend = useWaitForTransaction({
    confirmations: 1,
    hash: send.data?.hash,
  });

  useEffect(() => {
    if (watchSend.isSuccess) {
      toast.success(
        <TransactionMessage transactionHash={watchSend.data?.blockHash}>
          🎉 Transaction success!
        </TransactionMessage>
      );
      onSuccess();
      fireConfetti();
    }
  }, [watchSend]);

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
    onSettled: (data) => {
      allowance.refetch();
    },
    onError: (data) => {
      data.message.match('User rejected')
        ? toast.info('Transaction cancelled')
        : toast.error('Transaction failed');
    },
  });

  const watchSetAllowance = useWaitForTransaction({
    confirmations: 1,
    hash: setAllowance.data?.hash,
  });

  useEffect(() => {
    if (watchSetAllowance.isSuccess) {
      toast.success(
        <TransactionMessage transactionHash={watchSetAllowance.data?.blockHash}>
          🎉 Transaction success!
        </TransactionMessage>
      );
      onSuccess();
      fireConfetti();
    }
  }, [watchSetAllowance]);

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

  if (!account.isConnected) {
    return (
      <StyledPayButton
        onClick={() =>
          connectModal.openConnectModal && connectModal.openConnectModal()
        }
      >
        Connect wallet to pay
      </StyledPayButton>
    );
  }

  if (!sufficientBalance) {
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
