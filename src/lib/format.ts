import Decimal from 'decimal.js';
import { format } from 'path';
import { formatUnits, parseAccount, parseUnits } from 'viem/utils';

function precisionForTokenDecimals(decimals: number) {
  if (decimals < 6) {
    return decimals;
  }
  if (decimals < 9) {
    return 2;
  }
  if (decimals < 12) {
    return 3;
  }
  return 4;
}

export function reformatTokenAmount(
  amount: string | bigint,
  tokenDecimals: number
) {
  if (typeof amount === 'bigint') {
    amount = formatUnits(amount, tokenDecimals);
  }

  const precision = precisionForTokenDecimals(tokenDecimals);
  const d = new Decimal(amount);
  return d.toFixed(precision);
}
