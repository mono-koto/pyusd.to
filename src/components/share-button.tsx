'use client';

import { Button } from '@/components/ui/button';
import icon from '../../public/heartpyusd.svg';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';

import { BiQrScan } from 'react-icons/bi';
import ClientOnly from './client-only';

interface ShareProps {
  address: string;
  currentSlug?: string;
}
export function ShareButton({ address, currentSlug }: ShareProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <BiQrScan className="h-[1.4rem] w-[1.4rem] " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="m-6 border-2 border-transparent dark:border-foreground">
          <ClientOnly>
            <QRCodeSVG
              value={window.location.toString()}
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
      </DialogContent>
    </Dialog>
  );
}
