'use client';
import BoringAvatar from 'boring-avatars';
import { useState } from 'react';
import { isAddress } from 'viem';

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

  if (address && !isAddress(address)) {
    console.error('Bad address provided');
  }

  const [useFallback, setUseFallback] = useState(false);
  return (
    <div className="overflow-clip rounded-full">
      {!useFallback && ensImage ? (
        <img
          src={ensImage || ''}
          alt={`ENS avatar of ${address}`}
          height={size}
          width={size}
          onError={() => {
            setUseFallback(true);
          }}
        />
      ) : (
        <BoringAvatar size={size} name={address} variant="marble" />
      )}
    </div>
  );
}
