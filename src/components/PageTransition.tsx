'use client';

import { useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

const emptySubscribe = () => () => {};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const pathname = usePathname();

  // Publication pages must be visible even when JavaScript is disabled.
  if (pathname === '/publications' || pathname.startsWith('/publications/')) return <div>{children}</div>;

  return (
    <div className={`page-enter${mounted ? ' mounted' : ''}`}>
      {children}
    </div>
  );
}
