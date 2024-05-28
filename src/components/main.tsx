'use client';

import { useContext } from 'react';
import { SessionContext } from '@/providers/session';

export default function Main({ children }: { children: React.ReactNode }) {
  const { isAuthRoute, isPublicRoute } = useContext(SessionContext);

  return (
    <main className={`h-full flex bg-stone-100 dark:bg-stone-950 ${!isPublicRoute && !isAuthRoute ? 'ml-14' : ''}`}>
      {children}
    </main>
  );
}
