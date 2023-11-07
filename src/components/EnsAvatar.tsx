import { useEns } from "@/hooks/useEns";

import CustomAvatar from "./CustomAvatar";

export default function EnsAvatar({
  address,
  size,
}: {
  address: string | undefined;
  size?: number;
}) {
  const ens = useEns(address);
  size = size || 40;

  return (
    <CustomAvatar
      address={ens.data.address || ""}
      ensImage={ens.data.avatar}
      size={size}
    />
  );
}
