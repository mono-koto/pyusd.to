import { TokenListToken, useTokens } from "@/hooks/useTokens";

export function TokenDisplay({ token }: { token: TokenListToken }) {
  const tokens = useTokens();

  return (
    <>
      <img src={token.logoURI} className="w-6 h-6 mr-1.5" />
      <div>{token.symbol}</div>
    </>
  );
}
