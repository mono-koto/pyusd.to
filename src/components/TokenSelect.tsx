import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { TokenListToken, useTokens } from "@/hooks/useTokens";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "cmdk";
import { CheckIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { CommandList } from "./ui/command";
import { TokenDisplay } from "./TokenDisplay";

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

export function TokenSelect() {
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-fit rounded-xl p bg-pink-600 hover:bg-pink-500">
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
                  key={token.address}
                  value={`${token.address} ${token.name} ${token.symbol}`}
                  onSelect={() => {
                    onSelect(token);
                  }}
                >
                  <TokenListDisplay token={token} />
                  {/* <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === token ? "opacity-100" : "opacity-0"
                    )}
                  /> */}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {/* <CommandGroup className="scroll-auto">
            {tokens.map((token) => (
              <CommandItem
                key={token.address}
                value={`${token.address} ${token.name} ${token.symbol}`}
                onSelect={() => {
                  setValue(token);
                  // setOpen(false);
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
          </CommandGroup> */}
        </Command>

        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div> */}
        <DialogFooter>
          <Button type="submit">Select</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
