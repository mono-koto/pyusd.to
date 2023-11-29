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
import { Button } from '../../../components/ui/button';
import { TokenDetails } from '@/models';
import { useCallback } from 'react';

export function PayButton({
  nonZeroAmounts,
  updating,
  routeResult,
  sellTokenDetails,
}: {
  updating: boolean;
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

  const setAllowance = useContractWrite(prepareApprove.config);

  const fetching =
    allowance.isFetching || balance.isFetching || sendPrepare.isFetching;

  if (updating || fetching) {
    return (
      <Button className="h-fit rounded-xl py-4 text-lg" disabled>
        <LuLoader2 className="h-4 w-4 animate-spin duration-1000" />
        &nbsp; Updating
      </Button>
    );
  }

  if (!nonZeroAmounts) {
    return (
      <Button className="h-fit rounded-xl py-4 text-lg" disabled>
        Please enter an amount
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

  console.log(prepareApprove);

  if (needsApproval) {
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
      disabled={!sendPrepare.isSuccess}
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
