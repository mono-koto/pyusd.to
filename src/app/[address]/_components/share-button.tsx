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
import { QRCodeSVG } from 'qrcode.react';
import icon from '../../../../public/heartpyusd.svg';

import { useEffect, useState } from 'react';
import { IoMdShare } from 'react-icons/io';
import { LuClipboard, LuClipboardCheck } from 'react-icons/lu';

import ClientOnly from '../../../components/client-only';

import { ShareOptions } from './share-options';
import clsx from 'clsx';

interface ShareProps {
  ensOrAddress: string;
  currentSlug?: string;
}
export function ShareButton({ ensOrAddress, currentSlug }: ShareProps) {
  const [location, setLocation] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  useEffect(() => {
    setLocation(window.location.href);
  }, [setLocation]);

  const copyToClipboard = (text: string) => () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  let displayLocation = location;
  if (location.match(/0x.{40}/)) {
    displayLocation = location.substring(0, location.length - 20) + '...';
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <IoMdShare className="h-[1.5rem] w-[1.5rem]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-0 overflow-x-hidden lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Share {currentSlug || ensOrAddress} on PYUSD.to
          </DialogTitle>
          <DialogDescription>
            You can share this unique URL with anyone.
          </DialogDescription>
        </DialogHeader>

        <div className="min-w-auto flex max-w-full flex-col-reverse items-start justify-stretch gap-6 lg:flex-row">
          <div className="min-w-full lg:min-w-[200px]">
            <ClientOnly>
              <QRCodeSVG
                value={'xxx'}
                className="h-full w-full"
                imageSettings={{
                  src: icon.src,
                  height: 36,
                  width: 36,
                  excavate: true,
                }}
              />
            </ClientOnly>
          </div>
          <div className="w-full space-y-3">
            <div>
              <div
                className="border-muted-2 flex cursor-pointer flex-row items-center justify-between gap-2 overflow-hidden rounded-xl  border p-3 font-medium text-foreground transition-colors hover:text-primary active:bg-muted"
                onClick={copyToClipboard(location)}
              >
                <input
                  className="w-full overflow-ellipsis border-0 text-sm hover:cursor-pointer"
                  contentEditable={false}
                  defaultValue={location}
                  onClick={(e) => copyToClipboard(location)}
                />
                <div className="shrink-0">
                  {copied ? (
                    <LuClipboardCheck className="text-primary" />
                  ) : (
                    <LuClipboard />
                  )}
                </div>
              </div>
              <span
                className={clsx(
                  'ml-2',
                  'text-xs',
                  'opacity-0',
                  copied && 'opacity-50',
                  'transition-opacity'
                )}
              >
                Copied to clipboard!
              </span>
            </div>
            <ShareOptions shareUrl={location} who={ensOrAddress} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
