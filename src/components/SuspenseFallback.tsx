"use client";

import { Loader2 } from "lucide-react";
import React from "react";

const SuspenseFallback: React.FC = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <Loader2 className='w-12 h-12 animate-spin opacity-20' />
    </div>
  );
};

export default SuspenseFallback;
