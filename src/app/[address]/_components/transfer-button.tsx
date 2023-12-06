'use client';

import BlockscannerLink from '@/components/BlockscannerLink';
import { Button, ButtonProps } from '@/components/ui/button';
import { useConfetti } from '@/hooks/useConfetti';
import { UniswapRouteResult } from '@/hooks/useUniswap';
import { reformatTokenAmount } from '@/lib/format';
import { TokenDetails } from '@/models';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { ReactNode, useCallback, useEffect } from 'react';
import { LuLoader2 } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { formatUnits } from 'viem';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

export function TransferButton({
  nonZeroAmounts,
  updating,
  tokenDetails,
  amount,
  onSuccess,
}: {
  updating: boolean;
  nonZeroAmounts: boolean;
  tokenDetails: TokenDetails | undefined;
  amount: bigint;
  onSuccess: () => void;
}) {
  const { fireConfetti } = useConfetti();
  const account = useAccount();
  const connectModal = useConnectModal();

  const balance = useBalance({
    token: tokenDetails?.isNative ? undefined : tokenDetails?.address,
    address: account.address,
  });

  const sufficientBalance = balance.data && balance.data.value > amount;

  const prepareTransfer = usePrepareContractWrite({
    address: tokenDetails?.address,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [account.address!, amount],

    enabled:
      account.address &&
      tokenDetails &&
      sufficientBalance &&
      !tokenDetails?.isNative,
  });

  const transfer = useContractWrite({
    ...prepareTransfer.config,
    onMutate: (data) => {
      toast('Initiating transaction...');
    },
    onError: (data) => {
      data.message.match('User rejected')
        ? toast.info('Transaction cancelled')
        : toast.error('Transaction failed');
    },
  });

  const watchTransfer = useWaitForTransaction({
    confirmations: 1,
    hash: transfer.data?.hash,
  });

  useEffect(() => {
    if (watchTransfer.isSuccess) {
      toast.success(
        <TransactionMessage transactionHash={watchTransfer.data?.blockHash}>
          🎉 Sent!
        </TransactionMessage>
      );
      onSuccess();
      fireConfetti();
    }
  }, [
    watchTransfer.isSuccess,
    fireConfetti,
    onSuccess,
    watchTransfer.data?.blockHash,
  ]);

  const executeTransfer = useCallback(() => {
    if (!transfer.write) {
      console.error('Not yet ready to send');
      return;
    }
    transfer.write();
  }, [transfer]);

  const fetching = balance.isFetching || prepareTransfer.isFetching;

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
        Insufficient {tokenDetails?.symbol} Balance
      </StyledPayButton>
    );
  }

  if (transfer.isLoading) {
    return (
      <StyledPayButton disabled>
        <LuLoader2 className="h-4 w-4 animate-spin duration-1000" />
        &nbsp; Paying
      </StyledPayButton>
    );
  }

  return (
    <StyledPayButton
      disabled={!prepareTransfer.isSuccess}
      onClick={executeTransfer}
    >
      <Image
        src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg"
        height={20}
        width={20}
        alt="PYUSD Token"
      />
      &nbsp; Send{' '}
      {tokenDetails &&
        reformatTokenAmount(
          formatUnits(amount, tokenDetails?.decimals),
          tokenDetails.decimals
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
