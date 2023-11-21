'use client';

import { Loader2 } from 'lucide-react';
import React from 'react';

const SuspenseFallback: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin opacity-20" />
    </div>
  );
};

export default SuspenseFallback;
