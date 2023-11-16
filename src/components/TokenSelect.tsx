import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TokenListToken, useTokens } from "@/hooks/useTokens";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "cmdk";
import { useMemo, useState } from "react";
import { TokenDisplay } from "./TokenDisplay";
import { CommandList } from "./ui/command";

interface TokenSelectProps {
  onChange: (token: TokenListToken) => void;
}

export function TokenSelect({ onChange }: TokenSelectProps) {
  const tokens = useTokens();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<TokenListToken | undefined>();

  const defaultValue = useMemo(
    () => tokens.find((token) => token.symbol === "WETH")!,
    [tokens]
  );

  const onSelect = (token: TokenListToken) => {
    setOpen(false);
    setValue(token);
    if (token !== value) {
      onChange(token);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-fit rounded-xl p bg-primary">
          <TokenDisplay token={value || defaultValue} />
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
          />
          <CommandEmpty>No tokens found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {tokens.map((token) => (
                <CommandItem
                  className=" hover:bg-primary hover:text-primary-foreground p-1 transition-colors duration-75 cursor-pointer"
                  key={token.address}
                  value={`${token.address} ${token.name} ${token.symbol}`}
                  onSelect={() => {
                    onSelect(token);
                  }}
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

function TokenListDisplay({ token }: { token: TokenListToken }) {
  return (
    <div className="flex flex-row items-center space-x-2">
      <img src={token.logoURI} className="w-6 h-6" />
      <div>
        <div>{token.symbol}</div>
        <div className="text-sm">{token.address}</div>
      </div>
    </div>
  );
}
