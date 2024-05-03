'use client';

import { signOut } from 'next-auth/react';
import { SessionContext } from '@/providers/session';
import { useLocale } from '@/hooks/locale';
import { UserLanguage, UserTheme } from '@prisma/client';
import { useContext } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import useLoaded from '@/hooks/loaded';

export default function Home() {
  const { locale } = useLocale();
  const { theme, changeLanguage, changeTheme } = useContext(SessionContext);
  const { loaded } = useLoaded();
  const isDarkThemeEnabled = theme === UserTheme.dark;
  const languages = Object.values(UserLanguage);
  const sunIcon = <SunIcon className='h-5 w-5 text-stone-300' />;
  const moonIcon = <MoonIcon className='h-5 w-5 text-stone-950' />;

  if (!loaded) {
    return null;
  }

  async function logout() {
    await signOut({ redirect: false });
  }

  async function deleteAccount() {
    await fetch('/api/v1/auth/delete-account', { method: 'DELETE' });

    await logout();
  }

  return (
    <section className='flex flex-col gap-4 dark:text-stone-100 text-stone-950'>
      <h1 className='m-0'>{locale('text.home')}</h1>

      <span>{locale('text.welcome')}</span>

      <div className='flex gap-2'>
        {languages.map((language) => (
          <button
            className='p-2 w-20 border dark:border-stone-100 border-stone-950 dark:text-stone-100 text-stone-950 rounded-md'
            key={language}
            onClick={() => changeLanguage(language)}
          >
            {language}
          </button>
        ))}
      </div>

      <button
        aria-label='Change Theme'
        type='button'
        className='p-2 w-fit border dark:border-stone-100 border-stone-950 rounded-md'
        onClick={() => changeTheme(isDarkThemeEnabled ? UserTheme.light : UserTheme.dark)}
      >
        {isDarkThemeEnabled ? sunIcon : moonIcon}
      </button>

      <button
        onClick={deleteAccount}
        className='p-2 w-fit min-w-[80px] border dark:border-stone-100 border-stone-950 dark:text-stone-100 text-stone-950 rounded-md'
      >
        {locale('text.delete_account')}
      </button>

      <button
        onClick={logout}
        className='p-2 w-fit min-w-[80px] border dark:border-stone-100 border-stone-950 dark:text-stone-100 text-stone-950 rounded-md'
      >
        {locale('text.logout')}
      </button>
    </section>
  );
}
