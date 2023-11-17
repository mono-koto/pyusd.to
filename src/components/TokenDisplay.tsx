"use client";

import { TokenListToken } from "@/hooks/useTokens";

export function TokenDisplay({ token }: { token: TokenListToken }) {
  return (
    <>
      <img src={token.logoURI} className='w-6 h-6 mr-1.5' />
      <div>{token.symbol}</div>
    </>
  );
}
