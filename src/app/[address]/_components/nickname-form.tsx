'use client';

import { nicknameExists, submitNickname } from '../actions';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NicknameSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce } from '@uidotdev/usehooks';
import debouncePromise from 'awesome-debounce-promise';
import { useRouter } from 'next/navigation';
import { generateSlug } from 'random-word-slugs';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { Address } from 'viem';
import { z } from 'zod';

interface NicknameFormProps {
  address: Address;
}

const validateNicknameDoesNotExist = async (value: string) => {
  const response = await nicknameExists(value);
  return !response;
};

const schema = z.object({
  nickname: NicknameSchema.refine(
    debouncePromise(validateNicknameDoesNotExist, 1000),
    'Already exists'
  ),
});

export default function NicknameForm({ address }: NicknameFormProps) {
  const { register, handleSubmit, watch, formState, setValue, reset } =
    useForm<{
      nickname: string;
    }>({
      resolver: zodResolver(schema),
      mode: 'all',
    });

  const router = useRouter();

  const onSubmit = useCallback(
    async (data: any) => {
      reset(undefined, { keepValues: false });
      await submitNickname(address, data.nickname);
      router.push('/' + data.nickname);
    },
    [router, address, reset]
  );

  const onShuffle = useCallback(
    (e: React.FormEvent) => {
      const slug = generateSlug();
      setValue('nickname', slug, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      e.preventDefault();
    },
    [setValue, generateSlug]
  );

  const input = watch('nickname');

  const message = useCallback(() => {
    if (!input || input.length === 0) {
      return '🦄 Enter a unique name';
    }
    if (formState.isValidating) {
      return '⏳ Checking...';
    }
    if (formState.isSubmitting) {
      return '🤞 Creating...';
    }
    if (formState.errors.nickname) {
      if (formState.errors.nickname.message?.match(/Already exists/)) {
        return '👎 Already exists';
      }
      if (formState.errors.nickname.message?.match(/at least/)) {
        return '👎 Too short';
      }
      if (formState.errors.nickname.message?.match(/Invalid input/)) {
        return '🤔 Only letters, numbers, dashes. Oh, and emoji.';
      }
      return '❌ Invalid input';
    }
    if (formState.errors.root) {
      return '❌ Invalid input';
    }
    if (formState.isValid) {
      return '✅ Looking good!';
    }

    if (formState.isSubmitted) {
      return '🎉 Created!';
    }
    return '💭 Thinking...';
  }, [input, formState, formState.isSubmitSuccessful, formState.isSubmitted])();

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
                {...register('nickname')}
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
              <Button
                type="submit"
                disabled={
                  !formState.isValid ||
                  formState.isValidating ||
                  formState.isSubmitting ||
                  formState.isLoading
                }
              >
                Create
              </Button>
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
