'use client';

import { UserLanguage } from '@prisma/client';
import { useContext } from 'react';
import { SessionContext } from '@/providers/session';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/24/solid';
import { useLocale } from '@/hooks/locale';

export default function LanguageSelect() {
  const { changeLanguage } = useContext(SessionContext);
  const { locale } = useLocale();
  const languages = Object.values(UserLanguage);

  return (
    <Menu>
      <MenuButton
        id={`set-theme-button`}
        aria-label='Change Theme'
        className='p-2 w-fit'
      >
        <GlobeAltIcon className='h-5 w-5 text-stone-950 dark:text-stone-100' />
      </MenuButton>

      <MenuItems
        anchor='bottom'
        className='flex flex-col bg-stone-500 dark:bg-stone-800 rounded-md m-2'
      >
        {languages.map((language) => (
          <button
            id={`set-language-${language}-button`}
            className='p-2 w-full text-left hover:bg-stone-400 dark:hover:bg-stone-700'
            key={language}
            onClick={() => changeLanguage(language)}
          >
            {locale(`language.${language}`)}
          </button>
        ))}
      </MenuItems>
    </Menu>
  );
}
