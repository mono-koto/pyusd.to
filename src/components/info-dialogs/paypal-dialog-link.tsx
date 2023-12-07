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
import { LuChevronRight } from 'react-icons/lu';
import { PersonalizeButton } from '../personalize-button';

export function PayPalDialogLink({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <a className="cursor-pointer">{content}</a>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Hello PayPal friend!</DialogTitle>
          <DialogDescription>
            So you want to get paid with crypto? Let&apos;s do this.
          </DialogDescription>
        </DialogHeader>
        <article className="prose prose-sm prose-slate dark:prose-invert">
          <h4>I&apos;m not a crypto person. Is this going to be hard?</h4>
          <p>
            Not at all! You don&apos;t need a wallet or weird accounts or
            special phrases or anything.
          </p>
          <p>
            You&apos;re just wanting to get paid by someone who has crypto. This
            is an easy way to do it.
          </p>

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
            <li>Your QR code & PYUSD receiving address will appear.</li>
            <li>Copy the address.</li>
            <li>
              Paste PYUSD receiving address into home page of this dapp. Hit the
              arrow button:
              <br />
              <Button
                type="submit"
                size="icon"
                variant="outline"
                disabled={false}
                autoFocus={false}
                className="mb-0 ml-0 scale-75"
              >
                <LuChevronRight className="h-4 w-4" />
              </Button>
            </li>
            <li>
              On the next page &ndash;{' '}
              <code>pyusd.to/&lt;0x-your-address&gt;</code> &ndash; claim your
              unique URL using the &ldquo;Personalize URL&rdquo; button:
              <br />
              <PersonalizeButton className="mb-0 ml-0 scale-75" />
            </li>
            <li>
              Use your personal URL going forward to easily receive PYUSD from
              anyone!
            </li>
          </ol>

          <h4>Is this an official PayPal product?</h4>
          <p>
            Nope! This is a proof of concept app made by{' '}
            <a target="_blank" href="https://mono-koto.com/">
              Mono Koto
            </a>{' '}
            and{' '}
            <a target="_blank" href="https://gardenlabs.xyz/">
              Garden Labs
            </a>
            . PayPal doesn&apos;t endorse this app.
          </p>

          <h4>What are the fees for this?</h4>
          <p>
            This website doesn&apos;t charge any fees! But when people pay you,
            there will be a few costs:
          </p>
          <ul>
            <li>Gas fees for the Ethereum network</li>
            <li>Swap fees for the Uniswap network</li>
          </ul>

          <p>
            The exact amounts also depend on the current exchange rate at the
            time.
          </p>
        </article>
      </DialogContent>
    </Dialog>
  );
}
