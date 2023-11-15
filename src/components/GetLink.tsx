import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ethereumLogo from "../assets/img/ethereum.svg";
import paypalLogo from "../assets/img/paypal.svg";

import { useState } from "react";
import { Separator } from "./ui/separator";
import EnterAddress from "./EnterAddress";

export function GetLink() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Get your PYUSD.to link</Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Where do you want PYUSD to go?</DialogTitle>
          <DialogDescription>
            You can simply connect your current Ethereum wallet, or paste in a
            new address.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col ">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
