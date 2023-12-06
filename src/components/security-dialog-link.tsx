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

export function SecurityDialogLink({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <a className="cursor-pointer">{content}</a>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Security + Safety</DialogTitle>
        </DialogHeader>
        <article className="prose prose-slate dark:prose-invert prose-sm">
          <h4>
            What happens if I incur losses in connection with using this app?
          </h4>
          <p>
            This app and its creators take no legal or financial responsibility
            for any losses incurred for any reason. Use at your own risk.
          </p>

          <h4>Has this app been audited or reviewed?</h4>
          <p>
            No. This app is a proof of concept only. It has not been audited or
            reviewed by security researchers.
          </p>

          <h4>How do I know I'm getting the best swap rate?</h4>

          <p>
            As with all web3, please review transactions before sending. The
            swaps may not be optimal, and may be subject to{' '}
            <a
              href="https://ethereum.org/en/developers/docs/mev/"
              target="_blank"
            >
              MEV
            </a>
            . If you're looking to maximize your swap rate and protect against
            MEV, you may want to consider using an aggregated off-chain
            orderbook like{' '}
            <a href="https://swap.cow.fi/" target="_blank">
              CowSwap
            </a>
            .
          </p>

          <p>
            That said, all routing and contract interactions use Uniswap, which
            is an audited and heavily used protocol.
          </p>
        </article>
      </DialogContent>
    </Dialog>
  );
}
