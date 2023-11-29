'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { MdIosShare } from 'react-icons/md';
import NicknameForm from './nickname-form';

interface AddNicknameButtonProps extends ButtonProps {
  address: Address;
}

export function AddNicknameButton({
  address,
  ...props
}: AddNicknameButtonProps) {
  const [location, setLocation] = useState<string>('');
  useEffect(() => {
    setLocation(window.location.href);
  });
  console.log('nickname.address', address);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Customize</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create your custom link</DialogTitle>
          <DialogDescription>
            Send a memorable link to your friends
          </DialogDescription>
        </DialogHeader>
        <NicknameForm address={address} />
      </DialogContent>
    </Dialog>
  );
}
