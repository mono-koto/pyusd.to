import { isAddress } from "viem";
import { useEnsAddress, useEnsAvatar, useEnsName } from "wagmi";

interface EnsRecord {
  name: string | null;
  avatar: string | null;
  address: string;
}

export const useEns = (addressOrEns: string | undefined) => {
  const isAddr = isAddress(addressOrEns || "");
  console.log(addressOrEns);
  console.log(isAddr);

  const ensName = useEnsName({
    address: addressOrEns as `0x${string}`,
    enabled: isAddr,
  });

  console.log("ensAvatar enabled", isAddr ? ensName.data !== null : true);

  const ensAvatar = useEnsAvatar({
    name: isAddr ? ensName.data : addressOrEns,
    enabled: isAddr ? ensName.data !== null : true,
  });

  const ensAddress = useEnsAddress({
    name: addressOrEns,
    enabled: !isAddr && Boolean(addressOrEns),
  });

  console.log(ensAddress.data, ensAddress.status);

  if (isAddr) {
    if (ensName.isSuccess) {
      return {
        ...ensAddress,
        data: {
          name: ensName.data,
          avatar: ensAvatar.data,
          address: addressOrEns,
        } as EnsRecord,
      };
    } else {
      return {
        ...ensName,
        data: {
          name: null,
          avatar: null,
          address: addressOrEns,
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
};
