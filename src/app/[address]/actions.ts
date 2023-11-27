'use server';
import { z } from 'zod';
import { fromZodError, errorMap } from 'zod-validation-error';

import { emojiPattern } from '../api/nicknames/emoji-regex-string';
import { getAddress, isAddress } from 'viem';

import {
  findNickname,
  addNickname,
  findNicknamesByAddress,
} from '@/app/_db/nickname-repository';
import { revalidatePath } from 'next/cache';

const nicknamePattern = `^([a-zA-Z0-9_-]|${emojiPattern}|(?:\\p{L}))*$`;
const nicknameRegExp = new RegExp(nicknamePattern, 'u');
console.log(nicknameRegExp.test('☠️'));

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
  console.log(
    'submitNickname',
    formData.get('address'),
    formData.get('nickname')
  );
  const address = formData.get('address');
  const nickname = formData.get('nickname');

  const r = NicknameRequest.safeParse({
    address,
    nickname,
  });
  if (!r.success) {
    const validationError = fromZodError(r.error);
    console.log(fromZodError(r.error));
    revalidatePath('/');
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
    revalidatePath('/');
    return {
      status: 'error',
      message: (error as any).message,
    };
  }
}
