import BoringAvatar from "boring-avatars";
import { useState } from "react";
import { isAddress } from "viem";

export default function CustomAvatar({
  address,
  ensImage,
  size,
}: {
  address?: string;
  ensImage?: string | null;
  size?: number;
}) {
  size = size || 40;

  console.log(address, ensImage, size);

  if (address && !isAddress(address)) {
    console.error("Bad address provided");
  }

  const [useFallback, setUseFallback] = useState(false);
  return (
    <div className="rounded-full overflow-clip">
      {!useFallback && ensImage ? (
        <img
          src={ensImage || ""}
          alt={`ENS avatar of ${address}`}
          height={size}
          width={size}
          onError={(e) => {
            console.log(e);
            setUseFallback(true);
          }}
        />
      ) : (
        <BoringAvatar size={size} name={address} variant="marble" />
      )}
    </div>
  );
}
