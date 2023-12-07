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
import { FaMagic } from 'react-icons/fa';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PersonalizeButton } from '@/components/personalize-button';

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
  }, [setLocation]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <PersonalizeButton />
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
