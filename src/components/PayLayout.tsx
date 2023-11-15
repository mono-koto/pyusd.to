import { Suspense } from "react";
import SuspenseFallback from "./SuspenseFallback";

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto mt-12 max-w-xl">
      <Suspense fallback={<SuspenseFallback />}>{children}</Suspense>
    </main>
  );
}
