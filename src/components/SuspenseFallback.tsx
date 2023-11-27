'use client';

import { LuLoader2 } from 'react-icons/lu';
import React from 'react';

const SuspenseFallback: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <LuLoader2 className="h-12 w-12 animate-spin opacity-20" />
    </div>
  );
};

export default SuspenseFallback;
