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
} from 'wagmi';
import { Button } from '../../../components/ui/button';
import { TokenDetails } from '@/models';

export function PayButton({
  routeResult,
  sellTokenDetails,
}: {
  routeResult: UseQueryResult<UniswapRouteResult>;
  sellTokenDetails: TokenDetails | undefined;
}) {
  const account = useAccount();
  const tokenDetails = routeResult.data?.tokenInDetails;
  const allowance = useAllowance(
    sellTokenDetails?.address,
    account.address,
    routeResult.data?.methodParameters.to as Address
  );
  const balance = useBalance({
    token: sellTokenDetails?.isNative ? undefined : tokenDetails?.address,
    address: account.address,
  });

  const sendPrepare = usePrepareSendTransaction({
    data: routeResult.data?.methodParameters.calldata as `0x${string}`,
    to: routeResult.data?.methodParameters.to,
    value: BigInt(routeResult.data?.methodParameters.value || 0),
  });

  const send = useSendTransaction(sendPrepare.config);

  const sufficientBalance =
    balance.data &&
    (balance.data.value === BigInt(0) ||
      (routeResult.data &&
        balance.data.value >=
          parseUnits(
            routeResult.data.amountIn,
            routeResult.data.tokenInDetails.decimals
          )));

  const amountIn = routeResult.data
    ? BigInt(routeResult.data.amountIn)
    : BigInt(0);
  const sufficientAllowance =
    allowance.data !== undefined && allowance.data >= amountIn;

  const allowanceAmount = BigInt(0); //allowance.data ? amountIn - allowance.data : ;

  const prepareApprove = usePrepareApprove(
    tokenDetails?.address,
    account.address,
    routeResult.data?.methodParameters.to as Address,
    allowanceAmount,
    {
      enabled: sufficientBalance && !sufficientAllowance,
    }
  );

  const setAllowance = useContractWrite(prepareApprove.config);

  const updating =
    routeResult.isFetching ||
    allowance.isFetching ||
    balance.isFetching ||
    sendPrepare.isFetching;

  if (routeResult.isFetching || allowance.isFetching) {
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

  if (!sufficientAllowance) {
    return (
      <Button
        className="h-fit rounded-xl py-4 text-lg"
        onClick={() => {
          setAllowance.write && setAllowance.write();
        }}
        disabled={!prepareApprove.isSuccess}
      >
        Approve {tokenDetails?.symbol}
      </Button>
    );
  }

  return (
    <Button
      className="h-fit rounded-xl py-4 text-lg"
      disabled={!routeResult.isSuccess}
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
