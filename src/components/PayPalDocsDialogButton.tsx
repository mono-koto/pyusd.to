import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";

export function PayPalDocsDialogButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="disabled:opacity-50 text-xs px-3 h-8">
          Get your unique PYUSD address
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>How to get your PYUSD wallet address</DialogTitle>
          <DialogDescription>A quick guide for PayPal users</DialogDescription>
        </DialogHeader>
        <img src="/paypal-pyusd-address.gif" />
      </DialogContent>
    </Dialog>
  );
}
