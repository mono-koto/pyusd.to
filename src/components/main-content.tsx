import Loading from '@/app/loading';
import { Suspense } from 'react';

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto flex max-w-2xl flex-col p-2 xl:max-w-3xl">
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </main>
  );
}
