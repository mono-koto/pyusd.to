export const SLIPPAGE_PRECISION = 10000n;

/**
 * Calculates the slippage-adjusted amount based on the given amount and slippage.
 *
 * @param amount - The original amount.
 * @param slippage - The slippage value in basis points.
 * @returns The slippage-adjusted amount.
 */
export function slippageAdjustedAmount(amount: bigint, slippage: bigint) {
  return (amount * (SLIPPAGE_PRECISION - slippage)) / SLIPPAGE_PRECISION;
}
