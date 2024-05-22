'use client';

import LanguageSelect from '@/components/language-select';
import ThemeButton from '@/components/theme-button';
import Avatar from '@/components/avatar';
import { useContext } from 'react';
import { SessionContext } from '@/providers/session';
import { HomeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function Sidebar() {
  const { user, publicRoutes, currentRoute, authRoutes } = useContext(SessionContext);

  const privateSidebar = (
    <header className='flex flex-col items-center justify-between p-3 bg-stone-200 dark:bg-stone-900'>
      <div className='flex flex-col items-center gap-2'>
        <Avatar />

        <Link
          href='/'
          className='p-2 text-stone-900 dark:text-stone-100'
        >
          <HomeIcon className='w-5 h-5 text-stone-950 dark:text-stone-100' />
        </Link>
      </div>

      <div className='flex flex-col items-center gap-2'>
        <LanguageSelect />

        <ThemeButton />
      </div>
    </header>
  );
  const publicSidebar = (
    <header className='flex items-center justify-end w-full p-3 fixed'>
      <LanguageSelect />

      <ThemeButton />
    </header>
  );

  return !authRoutes.includes(currentRoute) && !publicRoutes.includes(currentRoute) ? privateSidebar : publicSidebar;
}
