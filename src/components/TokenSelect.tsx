'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TokenDetails } from '@/models';

import { useTokens } from '@/hooks/useTokens';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'cmdk';
import { useMemo, useState } from 'react';
import { CommandList } from './ui/command';
import { Address, isAddress } from 'viem';
import { useToken } from 'wagmi';
import { useTokenDetails } from '@/hooks/useTokenDetails';

interface TokenSelectProps {
  defaultToken?: Address;
  onChange: (token: TokenDetails) => void;
}

function TokenDisplay({ token }: { token: TokenDetails | undefined }) {
  if (!token) {
    return <span>Select a token</span>;
  } else {
    return (
      <>
        <img src={token.logoURI} className="mr-1.5 h-6 w-6" />
        <div>{token.symbol}</div>
      </>
    );
  }
}

export function TokenSelect({ defaultToken, onChange }: TokenSelectProps) {
  const tokens = useTokens();
  const [commandInputValue, setCommandInputValue] = useState('');
  const [currentToken, setCurrentToken] = useState<Address | undefined>(
    defaultToken
  );

  const currentTokenDetails = useTokenDetails(currentToken);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<TokenDetails | undefined>();

  const onSelect = (token: TokenDetails) => {
    setOpen(false);
    setValue(token);
    if (token !== value) {
      onChange(token);
    }
  };

  const onCommandInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommandInputValue(e.target.value);
    if (isAddress(e.target.value)) {
      setCurrentToken(e.target.value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="p h-fit rounded-xl bg-primary">
          <TokenDisplay token={currentTokenDetails.data} />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
          <DialogDescription>
            Select the token you want to send.
          </DialogDescription>
        </DialogHeader>

        <Command className="space-y-4">
          <CommandInput
            placeholder="Search tokens..."
            className="h-9 w-full p-2"
            onChangeCapture={onCommandInputChange}
            value={commandInputValue}
          />
          <CommandEmpty>No tokens found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {tokens.map((token) => (
                <CommandItem
                  className=" cursor-pointer p-1 transition-colors duration-75 hover:bg-primary hover:text-primary-foreground"
                  key={[token.address, token.symbol].join('-')}
                  value={`${token.address} ${token.name} ${token.symbol}`}
                  onSelect={() => {
                    onSelect(token);
                  }}
                  hidden={false}
                >
                  <TokenListDisplay token={token} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function TokenListDisplay({ token }: { token: TokenDetails }) {
  return (
    <div className="flex flex-row items-center space-x-2">
      <img src={token.logoURI} className="h-6 w-6" />
      <div>
        <div>{token.symbol}</div>
        <div className="text-sm">{token.address}</div>
      </div>
    </div>
  );
}
