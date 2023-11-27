import React, { useEffect } from 'react';

export default function ClientOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasMounted, setHasMounted] = React.useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return <>{hasMounted && children}</>;
}
