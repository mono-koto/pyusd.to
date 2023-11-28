'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TokenDetails } from '@/models';

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
      <img src={tokenDetails.logoURI} className="mr-1.5 h-6 w-6" />
      {tokenDetails.symbol}
    </Button>
  );
}
