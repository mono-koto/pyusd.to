'use client';

import { LuLoader2 } from 'react-icons/lu';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <LuLoader2 className="h-12 w-12 animate-spin opacity-20" />
    </div>
  );
};

export default Loading;
