'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TokenDetails } from '@/models';
import Image from 'next/image';

interface TokenButtonProps extends ButtonProps {
  tokenDetails: TokenDetails;
}

export function TokenButton({ tokenDetails, ...props }: TokenButtonProps) {
  const className = props.className;
  delete props.className;
  return (
    <Button
      className={cn('rounded-full p-2 pr-3', className)}
      variant="outline"
      {...props}
    >
      <Image
        src={tokenDetails.logoURI}
        className="mr-1.5 h-6 w-6"
        alt={`${tokenDetails.symbol} Token Logo`}
        height={24}
        width={24}
      />
      {tokenDetails.symbol}
    </Button>
  );
}
