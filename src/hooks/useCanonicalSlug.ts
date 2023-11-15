import { getAddress } from "viem";
import { useEns } from "./useEns";

export const useCanonicalSlug = (addressOrEns: string | undefined) => {
  const ens = useEns(addressOrEns);

  if (!ens.data) {
    return {
      ...ens,
      data: undefined,
    };
  } else if (ens.data.name) {
    return {
      ...ens,
      data: ens.data.name,
    };
  } else if (ens.data.address) {
    return {
      ...ens,
      data: ens.data.address,
    };
  }
  return {
    ...ens,
    data: undefined,
  };
};
