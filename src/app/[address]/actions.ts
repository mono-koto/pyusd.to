'use server';

import { Address } from 'viem';

import {
  addNickname,
  findNickname,
  findNicknamesByAddress,
} from '@/app/_db/nickname-repository';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getNickname(nickname: string) {
  return await findNickname(nickname);
}

export async function nicknameExists(nickname: string) {
  return (await findNickname(nickname)) !== undefined;
}

export interface SubmitNicknameState {
  message?: string;
  status: 'idle' | 'error' | 'success';
}

export async function getNicknamesByAddress(address: string) {
  return await findNicknamesByAddress(address);
}

export async function submitNickname(address: Address, nickname: string) {
  await addNickname(address.toLowerCase(), nickname);
  revalidatePath('/');
  redirect(`/${nickname}`);
}
