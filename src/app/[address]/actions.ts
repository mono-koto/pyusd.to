'use server';

import { z } from 'zod';
import { errorMap, fromZodError } from 'zod-validation-error';

import { isAddress } from 'viem';
import { emojiPattern } from './_components/emoji-regex-string';

import {
  addNickname,
  findNickname,
  findNicknamesByAddress,
} from '@/app/_db/nickname-repository';
import { revalidatePath } from 'next/cache';

const nicknamePattern = `^([a-zA-Z0-9_-]|${emojiPattern}|(?:\\p{L}))*$`;
const nicknameRegExp = new RegExp(nicknamePattern, 'u');

const NicknameRequest = z.object({
  address: z
    .string()
    .toLowerCase()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .refine((address) => isAddress(address)),
  nickname: z.string().refine((nickname) => {
    return nicknameRegExp.test(nickname);
  }),
});
z.setErrorMap(errorMap);

export async function getNickname(nickname: string) {
  return await findNickname(nickname);
}

export interface SubmitNicknameState {
  message?: string;
  status: 'idle' | 'error' | 'success';
}

export async function getNicknamesByAddress(address: string) {
  return await findNicknamesByAddress(address);
}

export async function submitNickname(
  prevState: SubmitNicknameState,
  formData: FormData
): Promise<SubmitNicknameState> {
  const address = formData.get('address');
  const nickname = formData.get('nickname');

  const r = NicknameRequest.safeParse({
    address,
    nickname,
  });
  if (!r.success) {
    const validationError = fromZodError(r.error);
    return {
      status: 'error',
      message: validationError.message,
    };
  }
  try {
    await addNickname(r.data.address, r.data.nickname);
    revalidatePath('/');
    return {
      status: 'success',
      message: 'Nickname added!',
    };
  } catch (error) {
    return {
      status: 'error',
      message: (error as any).message,
    };
  }
}
