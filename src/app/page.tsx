'use client';

import useLoaded from '@/hooks/loaded';

export default function Home() {
  const { loaded } = useLoaded();

  if (!loaded) {
    return null;
  }

  return <section className='flex flex-col gap-4'></section>;
}
