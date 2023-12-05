import React from 'react';
import { LuCookie } from 'react-icons/lu';

interface NotFoundProps {
  children?: React.ReactNode;
}

export default async function NotFound({
  children = <>Not found</>,
}: NotFoundProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 opacity-70">
      <LuCookie className="h-12 w-12" />
      <div className="flex flex-col gap-4">
        <div>{children}</div>
      </div>
    </div>
  );
}
