import { useMemo } from 'react';
import { Address, getAddress, isAddress } from 'viem';
import { useEnsAddress, useEnsAvatar, useEnsName } from 'wagmi';

interface EnsRecord {
  name: string | null;
  avatar: string | null;
  address: Address;
}

interface Options {
  suspense?: boolean;
}

export const useEns = (
  addressOrEns: string | undefined,
  options: Options = {}
) => {
  const isAddr = isAddress(addressOrEns || '');

  const ensName = useEnsName({
    address: addressOrEns as `0x${string}`,
    enabled: isAddr,
    chainId: 1,
    ...options,
  });

  const ensAvatar = useEnsAvatar({
    name: isAddr ? ensName.data : addressOrEns,
    enabled: isAddr ? ensName.data !== null : true,
    chainId: 1,
    ...options,
  });

  const ensAddress = useEnsAddress({
    name: addressOrEns,
    enabled: !isAddr && Boolean(addressOrEns),
    chainId: 1,
    ...options,
  });

  return useMemo(() => {
    if (isAddr) {
      if (ensName.isSuccess) {
        return {
          ...ensAddress,
          data: {
            name: ensName.data,
            avatar: ensAvatar.data,
            address: getAddress(addressOrEns!),
          } as EnsRecord,
        };
      } else {
        return {
          ...ensName,
          data: {
            name: null,
            avatar: null,
            address: getAddress(addressOrEns!),
          } as EnsRecord,
        };
      }
    } else {
      return {
        ...ensAddress,
        data: {
          name: addressOrEns,
          avatar: ensAvatar.data,
          address: ensAddress.data,
        } as EnsRecord,
      };
    }
  }, [isAddr, addressOrEns, ensName, ensAvatar, ensAddress]);
};
