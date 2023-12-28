import {
  findNickname,
  findNicknamesByAddress,
} from '@/app/_db/nickname-repository';
import { NextRequest, NextResponse } from 'next/server';
import { isAddress } from 'viem';

export const dynamic = 'force-dynamic'; // TODO - use caching instead

type ApiResponse = {
  kind: 'error' | 'address' | 'nickname';
} & (
  | { error: string }
  | { address: string; nicknames: string[] }
  | { nickname: string; address: string }
);

function corsResponse(body: ApiResponse, responseOptions: any = {}) {
  return NextResponse.json(body, {
    ...responseOptions,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function errorResponse(message: string, status: number) {
  return corsResponse(
    {
      kind: 'error',
      error: message,
    },
    {
      status,
    }
  );
}

export async function GET(
  request: NextRequest,
  { params: { addressOrName } }: { params: { addressOrName: string } }
) {
  if (addressOrName.endsWith('.eth')) {
    return errorResponse('ENS not yet supported', 400);
  } else if (isAddress(addressOrName)) {
    const nicknames = await findNicknamesByAddress(addressOrName);
    return corsResponse({
      kind: 'address',
      address: addressOrName,
      nicknames: nicknames.map((nickname) => nickname.value),
    });
  } else {
    const nickname = await findNickname(addressOrName);
    if (nickname?.address?.value) {
      return corsResponse({
        kind: 'nickname',
        nickname: addressOrName,
        address: nickname?.address?.value,
      });
    } else {
      return errorResponse('Not found', 404);
    }
  }
}
