'use client';

import * as React from 'react';
import { ChevronRightIcon, CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTokens } from '@/hooks/useTokens';
import { TokenDetails } from '@/models';

function TokenDisplay({ token }: { token: TokenDetails | undefined }) {
  return (
    <div className="flex flex-row space-x-2">
      {token ? (
        <>
          <img src={token.logoURI} className="h-6 w-6" />
          <span className="flex flex-col items-start gap-2">
            <span>{token.name}</span>
            <span>{token.symbol}</span>
          </span>
        </>
      ) : (
        <span className="flex flex-col items-start gap-2">
          <span>Select a token</span>
        </span>
      )}
    </div>
  );
}

export function TokenCombobox() {
  const tokens = useTokens();

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<TokenDetails | undefined>();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-fit w-[300px] justify-between"
        >
          <TokenDisplay token={value} />
          <ChevronRightIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] overflow-scroll p-0">
        <Command>
          <CommandInput placeholder="Search tokens..." className="h-9" />
          <CommandEmpty>No tokens found.</CommandEmpty>
          <CommandGroup className="scroll-auto">
            {tokens.map((token) => (
              <CommandItem
                key={token.address}
                value={`${token.address} ${token.name} ${token.symbol}`}
                onSelect={() => {
                  setValue(token);
                  setOpen(false);
                }}
              >
                <TokenDisplay token={token} />
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    value === token ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
