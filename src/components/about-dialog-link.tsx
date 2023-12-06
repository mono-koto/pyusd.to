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
import Image from 'next/image';
import Link from 'next/link';

import { useState } from 'react';

export function AboutDialogLink({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <a className="cursor-pointer">{content}</a>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>About PYUSD.to</DialogTitle>
        </DialogHeader>
        <article className="prose prose-slate dark:prose-invert prose-sm">
          <h4>How do I find my PYUSD wallet address in PayPal</h4>
          <p>
            If you have a PayPal account, you can get a PYUSD wallet address by
            following the{' '}
            <Link
              href="https://www.paypal.com/us/cshelp/article/how-do-i-transfer-my-crypto-HELP822"
              target="_blank"
            >
              steps for receiving crypto in your PayPal account
            </Link>
            :
          </p>
          <ol>
            <li>
              Go to the{' '}
              <Link
                href="https://www.paypal.com/myaccount/crypto/"
                target="_blank"
              >
                Finances tab
              </Link>
              .
            </li>
            <li>Tap your crypto balance.</li>
            <li>
              Tap the image Transfer arrows:{' '}
              <Image
                className="m-0 inline-block"
                src="https://www.paypalobjects.com/gops/crypto_transfer_arrows.png"
                width={24}
                height={24}
                alt="Transfer Arrows"
              />
            </li>
            <li>Tap Receive.</li>
            <li>Select PYUSD.</li>
            <li>Your QR code & PYUSD address will appear.</li>
            <li>Copy the address.</li>
          </ol>

          <h4>Why PYUSD.to?</h4>

          <p>
            We believe PYUSD has the potential to be a fiat-backed stable for
            the people, with the peg security of protocols like USDC, but
            accessible on/off-ramp liquidity available to millions of users.
          </p>

          <p>
            The PYUSD token effectively opens up PayPal&apos;s multi-sided web2
            commerce network to the Ethereum web3 network. Anyone with a crypto
            wallet can now pay a PayPal user via PYUSD, using readymade web3
            wallets, composed with DeFi protocols, and all leveraging
            Ethereum&apos;s transparency and security.
          </p>
        </article>
      </DialogContent>
    </Dialog>
  );
}
