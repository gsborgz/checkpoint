'use client';

import { signIn } from 'next-auth/react';
import { SyntheticEvent, useContext, useState } from 'react';
import { useLocale } from '@/hooks/locale';
import useLoaded from '@/hooks/loaded';
import { clientSignupSchema } from '@/validations/auth';
import { SnackbarContext } from '@/providers/snackbar';
import { SessionContext } from '@/providers/session';

export default function SignIn() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const { theme, language } = useContext(SessionContext);
  const { showErrorMessage } = useContext(SnackbarContext);
  const { locale } = useLocale();
  const { loaded } = useLoaded();

  if (!loaded) {
    return null;
  }

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    try {
      const body = { username, password, password_confirmation: passwordConfirmation, theme, language };

      clientSignupSchema.validateSync(body);

      const response = await fetch('api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await signIn('credentials', {
          username,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }
      } else {
        throw new Error(JSON.parse(await response.text()));
      }
    } catch (error) {
      showErrorMessage(error.message);
    }
  }

  return (
    <section className='flex flex-col gap-4 h-full w-full justify-center'>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='text-3xl mb-6'>{locale('text.register')}</h1>

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
          />

          <input
            className='h-12 rounded-md p-2 bg-transparent border dark:border-stone-100 border-stone-950'
            type='password'
            name='password'
            placeholder={locale('text.type_password')}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className='h-12 rounded-md p-2 bg-transparent border dark:border-stone-100 border-stone-950'
            type='password'
            name='password_confirmation'
            placeholder={locale('text.confirm_password')}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          <button
            type='submit'
            className='h-12 rounded-md dark:bg-stone-300 dark:text-stone-950 text-gray-300 bg-gray-800 hover:bg-gray-400'
          >
            {locale('text.send')}
          </button>
        </form>

        <a href='/signin'>{locale('text.to_signin_page')}</a>
      </div>
    </section>
  );
}
