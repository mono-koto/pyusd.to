'use client';

import {
  SubmitNicknameState,
  getNickname,
  nicknameExists,
  submitNickname,
} from '../actions';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCallback, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { generateSlug } from 'random-word-slugs';
import { useDebounce } from '@uidotdev/usehooks';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { Address } from 'viem';
import { Button } from '@/components/ui/button';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

interface NicknameFormProps {
  address: Address;
}

const initialState: SubmitNicknameState = {
  status: 'idle',
};

type Inputs = {
  nickname: string;
};

export default function NicknameForm({ address }: NicknameFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({});

  const input = watch('nickname');
  const debouncedInput = useDebounce(input || '', 1000);
  const [shuffledInput, setShuffledInput] = useState<string>('');

  const nickname = input === shuffledInput ? input : debouncedInput;

  const checkNicknameExists = useQuery({
    queryKey: ['get-nickname', nickname],
    queryFn: async () => {
      const response = await nicknameExists(nickname);
      return response;
    },
    enabled: nickname.length > 0,
  });

  const onSubmit = useCallback(
    async (data: any) => {
      const response = await submitNickname(address, debouncedInput);
    },
    [address, debouncedInput]
  );

  const onShuffle = useCallback(
    (e: React.FormEvent) => {
      const slug = generateSlug();
      setShuffledInput(slug);
      setValue('nickname', slug, {});
      e.preventDefault();
    },
    [setValue, generateSlug]
  );

  const nicknameAvailable =
    checkNicknameExists.isSuccess && !checkNicknameExists.data;

  const message = useCallback(() => {
    switch (checkNicknameExists.status) {
      case 'error':
        return 'Unable to load';
      case 'loading':
        switch (checkNicknameExists.fetchStatus) {
          case 'fetching':
            return 'Checking...';
          case 'paused':
            return 'Paused...';
          default:
            return 'Please provide a unique URL of your choice';
        }
      case 'success':
        return checkNicknameExists.data ? '👎 Taken!' : '👍 Looks good!';
      default:
        return 'Ready';
    }
  }, [checkNicknameExists])();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border-gray flex flex-col rounded-xl border p-2">
          <div className="flex flex-row items-baseline gap-1">
            <div className="flex flex-grow flex-row items-baseline">
              <Label className="flex-grow-0 border-none bg-transparent text-lg opacity-70 focus:outline-none focus:ring-0">
                pyusd.to/
              </Label>
              <input
                autoFocus
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
                type="text"
                {...register('nickname', { required: true })}
                className="h-12 w-full border-none bg-transparent text-lg text-primary focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex flex-row gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={onShuffle}
              >
                <GiPerspectiveDiceSixFacesRandom className="h-6 w-6" />
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </div>
          <div className="flex flex-row justify-between gap-2 text-xs">
            <span className="text-gray-500">{message}</span>
          </div>
        </div>
      </form>
    </>
  );
}
