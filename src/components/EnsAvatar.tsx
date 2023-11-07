import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEns } from "@/hooks/useEns";
import clsx from "clsx";

import BoringAvatar from "boring-avatars";

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
    <Avatar
      className={clsx(
        ens.isLoading && "animate-pulse",
        `w-[${size}px] h-[${size}px]`
      )}
    >
      <AvatarImage src={ens.data.avatar || ""} />
      <AvatarFallback>
        {ens.data.address && (
          <BoringAvatar size={size} name={ens.data.address} variant="marble" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
