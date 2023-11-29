import { z } from 'zod';
import { errorMap } from 'zod-validation-error';

import { emojiPattern } from '@/lib/emoji-regex-string';
import { isAddress } from 'viem';

const nicknamePattern = `^([a-zA-Z0-9_-]|${emojiPattern}|(?:\\p{L}))*$`;
const nicknameRegExp = new RegExp(nicknamePattern, 'u');

export const AddressValidation = z
  .string()
  .toLowerCase()
  .regex(/^0x[a-fA-F0-9]{40}$/)
  .refine((address) => isAddress(address));

export const NicknameValidation = z.string().refine((nickname) => {
  return nicknameRegExp.test(nickname);
});

export const CreateNicknameRequest = z.object({
  address: AddressValidation,
  nickname: NicknameValidation,
});
z.setErrorMap(errorMap);
