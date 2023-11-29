'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import icon from '../../public/heartpyusd.svg';

import { useEffect, useState } from 'react';
import { BiQrScan } from 'react-icons/bi';
import ClientOnly from './client-only';

interface ShareProps {
  address: string;
  currentSlug?: string;
}
export function QrButton({ address, currentSlug }: ShareProps) {
  const [location, setLocation] = useState<string>('');
  useEffect(() => {
    setLocation(window.location.href);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <BiQrScan className="h-[2rem] w-[2rem]" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="m-2 border-2 border-transparent dark:border-foreground md:m-6">
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
      </DialogContent>
    </Dialog>
  );
}
