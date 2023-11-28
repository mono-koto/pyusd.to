import { Address } from 'viem';
import { useContractRead, usePrepareContractWrite, erc20ABI } from 'wagmi';

/**
 * Custom hook to get the allowance of a token for a specific owner and spender.
 *
 * @param token - The address of the token.
 * @param owner - The address of the owner.
 * @param spender - The address of the spender.
 * @param options - Additional options for the hook.
 * @returns An object containing the result of the contract read operation and the allowance data.
 */
export function useAllowance(
  token: Address | undefined,
  owner: Address | undefined,
  spender: Address | undefined,
  options: any = {}
) {
  const enabled = options.enabled === undefined || options.enabled;
  const result = useContractRead({
    address: token,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [owner, spender],
    ...options,
    enabled: Boolean(owner) && Boolean(token) && Boolean(spender),
  });

  return {
    ...result,
    data: result.data as bigint | undefined,
  };
}

/**
 * Prepares the approval of a specific amount of tokens by the owner to be spent by a specific spender.
 *
 * @param token The address of the token.
 * @param owner The address of the token owner.
 * @param spender The address of the token spender.
 * @param amount The amount of tokens to be approved.
 * @param options Additional options for preparing the approval.
 * @returns The prepared contract write operation.
 */
export function usePrepareApprove(
  token: Address | undefined,
  owner: Address | undefined,
  spender: Address | undefined,
  amount: bigint | undefined,
  options: any = {}
) {
  const enabled = options.enabled === undefined || options.enabled;
  return usePrepareContractWrite({
    account: owner,
    address: token,
    abi: erc20ABI,
    functionName: 'approve',
    args: [spender!, amount!],
    enabled: Boolean(token) && Boolean(owner) && Boolean(spender) && enabled,
  });
}
