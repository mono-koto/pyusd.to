import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import * as NicknameRepository from '@/app/_db/nickname-repository';

export const runtime = 'nodejs'; // 'nodejs' is the default

export async function GET(
  request: NextRequest,
  { params }: { params: { nickname: string } }
) {
  const nickname = await NicknameRepository.findNickname(params.nickname);
  if (nickname) {
    return NextResponse.json({
      nickname,
    });
  }
}

// params.nickname
//   const nicknames = await NicknameRepository.findNicknamesByAddress(
//   return NextResponse.json({});
// }
