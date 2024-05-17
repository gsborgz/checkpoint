'use client';

import { SyntheticEvent, useContext, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useLocale } from '@/hooks/locale';
import { UserLanguage, UserTheme } from '@prisma/client';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import useLoaded from '@/hooks/loaded';
import { SessionContext } from '@/providers/session';
import { SnackbarContext } from '@/providers/snackbar';
import { SnackbarTheme } from '../../components/snackbar';

export default function SignIn() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { theme, changeLanguage, changeTheme } = useContext(SessionContext);
  const { showErrorMessage } = useContext(SnackbarContext);
  const { locale } = useLocale();
  const { loaded } = useLoaded();
  const isDarkThemeEnabled = theme === UserTheme.dark;
  const languages = Object.values(UserLanguage);
  const sunIcon = <SunIcon className='h-5 w-5 text-stone-300' />;
  const moonIcon = <MoonIcon className='h-5 w-5 text-stone-950' />;

  if (!loaded) {
    return null;
  }

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      showErrorMessage(error.message);
    }
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

      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='text-3xl mb-6'>{locale('text.login')}</h1>

        <form
          className='w-[400px] flex flex-col gap-6'
          onSubmit={handleSubmit}
        >
          <input
            className='h-12 rounded-md p-2 bg-transparent border dark:border-stone-100 border-stone-950'
            type='text'
            name='username'
            placeholder={locale('text.type_username')}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />

          <input
            className='h-12 rounded-md p-2 bg-transparent border dark:border-stone-100 border-stone-950'
            type='password'
            name='password'
            placeholder={locale('text.type_password')}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button
            type='submit'
            className='h-12 rounded-md dark:bg-stone-300 dark:text-stone-950 text-gray-300 bg-gray-800 hover:bg-gray-400'
          >
            {locale('text.send')}
          </button>
        </form>

        <a href='/signup'>{locale('text.to_signup_page')}</a>
      </div>
    </section>
  );
}
