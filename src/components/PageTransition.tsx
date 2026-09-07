'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  return (
    <div className={`page-enter${mounted ? ' mounted' : ''}`}>
      {children}
    </div>
  );
}
