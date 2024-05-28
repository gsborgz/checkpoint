'use client';

import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/24/solid';
import { useLocale } from '@/hooks/locale';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Avatar() {
  const { locale } = useLocale();

  async function logout() {
    await signOut({ redirect: false });
  }

  return (
    <Menu>
      <MenuButton
        id='avatar-button'
        aria-label='Session options'
        className='p-2 w-fit border dark:border-stone-100 border-stone-950 rounded-md'
      >
        <UserIcon className='h-5 w-5 text-stone-950 dark:text-stone-100' />
      </MenuButton>

      <MenuItems
        anchor='bottom'
        className='flex flex-col bg-stone-500 dark:bg-stone-800 rounded-md m-2'
      >
        <Link
          className='p-2 min-w-[5rem] w-full text-center hover:bg-stone-400 dark:hover:bg-stone-700'
          href='/profile'
        >
          {locale('auth.profile')}
        </Link>

        <button
          id='logout-button'
          className='p-2 min-w-[5rem] w-full hover:bg-stone-400 dark:hover:bg-stone-700'
          onClick={logout}
        >
          {locale('text.logout')}
        </button>
      </MenuItems>
    </Menu>
  );
}
