'use client';

import { useContext } from 'react';
import { SessionContext } from '@/providers/session';
import { UserTheme } from '@prisma/client';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

export default function ThemeButton() {
  const { theme, changeTheme } = useContext(SessionContext);
  const isDarkThemeEnabled = theme === UserTheme.dark;
  const sunIcon = <SunIcon className='h-5 w-5 text-stone-100' />;
  const moonIcon = <MoonIcon className='h-5 w-5 text-stone-950' />;

  return (
    <button
      id={`set-theme-button`}
      aria-label='Change Theme'
      type='button'
      className='p-2 w-fit'
      onClick={() => changeTheme(isDarkThemeEnabled ? UserTheme.light : UserTheme.dark)}
    >
      {isDarkThemeEnabled ? sunIcon : moonIcon}
    </button>
  );
}
