"use client";

import * as React from "react";
import { ChevronRightIcon, CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TokenListToken, useTokens } from "@/hooks/useTokens";

function TokenDisplay({ token }: { token: TokenListToken }) {
  return (
    <div className="flex flex-row space-x-2">
      <img src={token.logoURI} className="w-6 h-6" />
      <span className="flex flex-col items-start gap-2">
        <span>{token.name}</span>
        <span>{token.symbol}</span>
      </span>
    </div>
  );
}

export function TokenCombobox() {
  const tokens = useTokens();

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<TokenListToken | undefined>();

  const defaultValue = tokens.find((token) => token.symbol === "WETH")!;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between h-fit"
        >
          <TokenDisplay token={value || defaultValue} />
          <ChevronRightIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 overflow-scroll">
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
                    "ml-auto h-4 w-4",
                    value === token ? "opacity-100" : "opacity-0"
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
