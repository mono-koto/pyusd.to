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
        <article className="prose prose-sm prose-slate dark:prose-invert">
          <h4>Why did we build PYUSD.to?</h4>

          <p>
            We believe PYUSD has the potential to be a fiat-backed stable{' '}
            <span className="italic">for the people</span>, with the peg
            security of protocols like USDC, but accessible on/off-ramp
            liquidity available to millions of users.
          </p>

          <p>
            The PYUSD token effectively opens up PayPal&apos;s multi-sided web2
            commerce network to the Ethereum web3 network. Anyone with a crypto
            wallet can now pay a PayPal user via PYUSD, using readymade web3
            wallets, composed with DeFi protocols, and all leveraging
            Ethereum&apos;s transparency and security.
          </p>

          <h4>How does this work?</h4>

          <p>
            Under the hood this dapp uses{' '}
            <a href="https://uniswap.org" target="_blank">
              Uniswap
            </a>{' '}
            which is an AMM (automated market maker) protocol on Ethereum.
          </p>
          <p>
            We use the{' '}
            <a
              href="https://github.com/Uniswap/smart-order-router"
              target="_blank"
            >
              Uniswap Alpha Router
            </a>{' '}
            to find the optimal swap path and to generate transaction calldata,
            which we then ask your wallet to sign.
          </p>

          <p>
            Built with <a href="https://www.typescriptlang.org/">Typescript</a>,{' '}
            <a href="https://nextjs.org/">NextJS</a>,{' '}
            <a href="https://vercel.com/">Vercel</a>,{' '}
            <a href="https://tailwindcss.com/">TailwindCSS</a>,{' '}
            <a href="https://viem.sh/">Viem</a>,{' '}
            <a href="https://wagmi.dev/">Wagmi</a>,{' '}
            <a href="https://www.rainbowkit.com/">RainbowKit</a>,{' '}
            <a href="https://kysely.dev/">Kysely</a>,{' '}
            <a href="https://www.postgresql.org/">PostgreSql</a>,{' '}
            <a href="https://ui.shadcn.com/">ShadCN</a> +{' '}
            <a href="https://radix-ui.com/">Radix</a>,{' '}
            <a href="https://react-icons.github.io/react-icons/">React Icons</a>
            ,{' '}
            <a href="https://github.com/mono-koto/pyusd.to/blob/main/package.json">
              and much more
            </a>
            .
          </p>
        </article>
      </DialogContent>
    </Dialog>
  );
}
