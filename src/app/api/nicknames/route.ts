import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import * as NicknameRepository from '../../_db/nickname-repository';
import { z } from 'zod';

import { emojiPattern } from './emoji-regex-string';
import { getAddress, isAddress } from 'viem';

const nicknamePattern = `^([a-zA-Z0-9_-]|${emojiPattern}|(?:\\p{L}))*$`;
const nicknameRegExp = new RegExp(nicknamePattern, 'u');
console.log(nicknameRegExp.flags);

const NicknameRequest = z.object({
  address: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .refine((address) => isAddress(address)),
  nickname: z.string().refine((nickname) => {
    return nicknameRegExp.test(nickname);
  }),
});

export const runtime = 'nodejs'; // 'nodejs' is the default

// export async function GET(request: NextRequest) {

//   request.nextUrl = '/api/nicknames';

//   const nicknames = await NicknameRepository.findNicknamesByAddress(
//   return NextResponse.json({});
// }

export async function POST(request: NextRequest) {
  const r = NicknameRequest.parse(request.body);
  const n = await NicknameRepository.addNickname(r.address, r.nickname);
  let response = NextResponse.next();
  return Response.json(n, {
    status: 201,
  });
}
