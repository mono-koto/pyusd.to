'use client';

import { useAllowance, usePrepareApprove } from '@/hooks/useAllowance';
import { UniswapRouteResult } from '@/hooks/useUniswap';
import { UseQueryResult } from '@tanstack/react-query';
import { LuLoader2 } from 'react-icons/lu';
import { Address, parseUnits } from 'viem';
import {
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi';
import { Button } from '../../../components/ui/button';
import { TokenDetails } from '@/models';
import { useCallback } from 'react';

export function PayButton({
  nonZeroAmounts,
  routeResult,
  sellTokenDetails,
}: {
  nonZeroAmounts: boolean;
  routeResult: UniswapRouteResult | undefined;
  sellTokenDetails: TokenDetails | undefined;
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

  const sendPrepare = usePrepareSendTransaction({
    data: routeResult?.methodParameters.calldata as `0x${string}`,
    to: routeResult?.methodParameters.to,
    value: BigInt(routeResult?.methodParameters.value || 0),
  });

  const send = useSendTransaction(sendPrepare.config);

  const executeSwap = useCallback(() => {
    if (!send.sendTransaction) {
      console.error('Not yet ready to send');
      return;
    }
    send.sendTransaction();
  }, [send.sendTransaction]);

  const t = useWaitForTransaction({
    hash: send.data?.hash,
  });

  const amountIn = routeResult
    ? parseUnits(routeResult.amountIn, routeResult.tokenInDetails.decimals)
    : BigInt(0);

  const sufficientBalance = balance.data && balance.data.value > amountIn;

  const readyForApproval =
    allowance.data !== undefined &&
    allowance.data < amountIn &&
    !sellTokenDetails?.isNative;

  const allowanceAmount = amountIn;

  const prepareApprove = usePrepareApprove(
    sellTokenDetails?.address,
    account.address,
    routeResult?.methodParameters.to as Address,
    allowanceAmount,
    {
      enabled: sufficientBalance && readyForApproval,
    }
  );

  const setAllowance = useContractWrite(prepareApprove.config);

  const updating =
    allowance.isFetching || balance.isFetching || sendPrepare.isFetching;

  if (!nonZeroAmounts) {
    <Button className="h-fit rounded-xl py-4 text-lg" disabled>
      Please enter an amount
    </Button>;
  }

  if (allowance.isFetching) {
    return (
      <Button className="h-fit rounded-xl py-4 text-lg" disabled>
        <LuLoader2 className="h-4 w-4 animate-spin duration-1000" />
        &nbsp; Updating
      </Button>
    );
  }

  if (!sufficientBalance) {
    return (
      <Button className="h-fit rounded-xl py-4 text-lg" disabled>
        Insufficient {sellTokenDetails?.symbol} Balance
      </Button>
    );
  }

  if (readyForApproval) {
    return (
      <Button
        className="h-fit rounded-xl py-4 text-lg"
        onClick={() => {
          setAllowance.write && setAllowance.write();
        }}
        disabled={!prepareApprove.isSuccess}
      >
        Approve {sellTokenDetails?.symbol}
      </Button>
    );
  }

  return (
    <Button
      className="h-fit rounded-xl py-4 text-lg"
      disabled={!routeResult}
      onClick={executeSwap}
    >
      <img
        src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg"
        height={20}
        width={20}
      />
      &nbsp; Pay
    </Button>
  );
}
