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

import { useTokenDetails } from '@/hooks/useTokenDetails';
import { usePreferredTokens, useTokens } from '@/hooks/useTokens';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'cmdk';
import { useState } from 'react';
import { Address, isAddress } from 'viem';
import { CommandList } from '../../../components/ui/command';
import { TokenButton } from './token-button';

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
    setCurrentToken(token.address);
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

  const preferredTokens = usePreferredTokens();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="p h-fit rounded-xl bg-primary">
          <TokenDisplay token={currentTokenDetails.data} />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-4">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
          <DialogDescription>
            Select the token you want to send.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-row flex-wrap justify-center gap-2">
          {preferredTokens.map((token, i) => (
            <TokenButton
              tokenDetails={token}
              key={i}
              onClick={() => onSelect(token)}
            />
          ))}
        </div>

        <Command className="space-y-4">
          <CommandInput
            autoFocus
            placeholder="Search tokens..."
            className="h-9 w-full p-1"
            onChangeCapture={onCommandInputChange}
            value={commandInputValue}
          />
          <CommandEmpty>No tokens found.</CommandEmpty>
          <CommandList className="w-full overflow-x-clip">
            <CommandGroup>
              {tokens.map((token) => (
                <CommandItem
                  className=" cursor-pointer rounded-md p-1 transition-colors duration-75 aria-selected:bg-primary aria-selected:text-primary-foreground"
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
    <div className="flex flex-row items-center space-x-2 pr-2">
      <img src={token.logoURI} className="h-6 w-6" alt={`${token.name} logo`} />
      <div className="overflow-ellipsis">
        <div>{token.name}</div>
        <div className="text-sm">{token.symbol}</div>
      </div>
    </div>
  );
}
