'use client';

import { useContext, useEffect, useState } from 'react';
import { useLocale } from '@/hooks/locale';
import { AppStatus } from '@/app/api/v1/status/route';
import { SessionContext } from '../../providers/session';
import { UserLanguage, UserTheme } from '@prisma/client';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

export default function Status() {
  const { locale } = useLocale();
  const [status, setStatus] = useState<AppStatus>();
  const { theme, changeLanguage, changeTheme } = useContext(SessionContext);
  const isDarkThemeEnabled = theme === UserTheme.dark;
  const languages = Object.values(UserLanguage);
  const sunIcon = <SunIcon className='h-5 w-5 text-stone-300' />;
  const moonIcon = <MoonIcon className='h-5 w-5 text-stone-950' />;

  useEffect(() => {
    async function getStatus() {
      const res = await fetch('/api/v1/status');
      const data = await res.json();

      setStatus(data);
    }

    getStatus();
  }, []);

  if (!status) {
    return null;
  }

  return (
    <section className='flex flex-col gap-4 h-full'>
      <div className='flex gap-2'>
        {languages.map((language) => (
          <button
            id={`set-language-${language}-button`}
            className='p-2 w-20 border dark:border-stone-100 border-stone-950 rounded-md'
            key={language}
            onClick={() => changeLanguage(language)}
          >
            {language}
          </button>
        ))}
      </div>

      <button
        id={`set-theme-button`}
        aria-label='Change Theme'
        type='button'
        className='p-2 w-fit border dark:border-stone-100 border-stone-950 rounded-md'
        onClick={() => changeTheme(isDarkThemeEnabled ? UserTheme.light : UserTheme.dark)}
      >
        {isDarkThemeEnabled ? sunIcon : moonIcon}
      </button>

      <div className='flex flex-col items-center justify-center gap-3'>
        <h1>{locale('status.title')}</h1>

        <span>
          <span id='status-updated-at'>{`${locale('status.updated_at')}`}</span>:&nbsp;
          <span id='status-updated-at-value'>{`${new Date(status.updated_at).toLocaleDateString()} ${new Date(status.updated_at).toLocaleTimeString()}`}</span>
        </span>

        <div className='flex flex-col gap-1'>
          <span>{locale('status.dependencies')}:</span>
          <ul>{locale('status.database')}</ul>
          <li>
            <span id='db-version'>{`${locale('status.version')}`}</span>:&nbsp;
            <span id='db-version-value'>{`${status.dependencies.database.version}`}</span>
          </li>
          <li>
            <span id='db-max-connections'>{`${locale('status.max_connections')}`}</span>:&nbsp;
            <span id='db-max-connections-value'>{`${status.dependencies.database.max_connections}`}</span>
          </li>
          <li>
            <span id='db-opened-connections'>{`${locale('status.opened_connections')}`}</span>:&nbsp;
            <span id='db-opened-connections-value'>{`${status.dependencies.database.opened_connections}`}</span>
          </li>
        </div>
      </div>
    </section>
  );
}
