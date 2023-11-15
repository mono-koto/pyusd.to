import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Wallet } from "lucide-react";
import { useCallback, useState } from "react";
import { Icons } from "./Icons";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import payPalGif from "@/assets/img/paypal-pyusd-address.gif";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useCanonicalSlug } from "@/hooks/useCanonicalSlug";
import { navigate } from "wouter/use-location";

export function GetLink() {
  const [open, setOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState<
    "paypal" | "my-wallet" | "other-wallet"
  >("paypal");

  const account = useAccount();
  const canonicalSlug = useCanonicalSlug(account.address);

  const onChange = (value: string) => {
    setCurrentContent(value as "paypal" | "my-wallet" | "other-wallet");
  };

  const onChangeOpen = useCallback(() => {
    setOpen(!open);
    if (!open) {
      setCurrentContent("paypal");
    }
  }, [open]);

  const onClickMyWallet = useCallback(() => {
    if (account.address) {
      navigate("/#/" + account.address);
    }
  }, [account.address, canonicalSlug]);

  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogTrigger asChild>
        <Button>Get your PYUSD.to link</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Where do you want PYUSD to go?</DialogTitle>
          <DialogDescription>
            You can connect your current Ethereum wallet or enter an Ethereum
            address.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          defaultValue="paypal"
          onValueChange={onChange}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem
              value="paypal"
              id="paypal"
              className="peer sr-only"
            />
            <Label
              htmlFor="paypal"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Icons.paypal className="mb-3 h-6 w-6" />
              My PayPal
            </Label>
          </div>{" "}
          <div>
            <RadioGroupItem
              onClick={onClickMyWallet}
              value="my-wallet"
              id="my-wallet"
              className="peer sr-only"
            />
            <Label
              htmlFor="my-wallet"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Wallet className="mb-3 h-6 w-6 " />
              My Wallet
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="other-wallet"
              id="other-wallet"
              className="peer sr-only"
            />
            <Label
              htmlFor="other-wallet"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Icons.ethereum className="mb-3 h-6 w-6" />
              Another Wallet
            </Label>
          </div>
        </RadioGroup>

        <div className="transition-height h-fit duration-500 ease-in-out">
          {currentContent === "paypal" && (
            <div className="space-y-6">
              <h2>Here's how to get your wallet address</h2>
              <img
                src={payPalGif}
                className="rounded-md border-2 border-muted"
              />
              <div></div>
            </div>
          )}
          {currentContent === "my-wallet" && (
            <div
              className="flex min-h-fit flex-row justify-center space-y-6"
              data-rk
            >
              <ConnectButton />
            </div>
          )}
        </div>

        {/* <div className="flex flex-col ">
          <div className="">
            <EnterAddress />
          </div>
          <div className="">
            <img src={ethereumLogo} className="m-auto w-1/3" />
            <Button>Connect</Button>
            or
          </div>
          <Separator decorative />
          <div className="">
            <img src={paypalLogo} className="m-auto w-2/3" />
            <Button>Get address</Button>
          </div>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
