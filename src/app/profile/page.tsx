'use client';

import { useContext } from 'react';
import { SessionContext } from '@/providers/session';
import { useLocale } from '@/hooks/locale';
import { signOut } from 'next-auth/react';

export default function Profile() {
  const { user } = useContext(SessionContext);
  const { locale } = useLocale();

  async function deleteAccount() {
    await fetch('/api/v1/auth/delete-account', { method: 'DELETE' });

    await signOut({ redirect: false });
  }

  return (
    <section className='flex flex-col items-center gap-4 w-full m-4'>
      <div className='flex flex-col bg-stone-300 p-2 dark:bg-stone-800 rounded-md gap-2 w-[36rem]'>
        <div className='flex flex-col gap-1'>
          <label>{locale('auth.username')}</label>
          <span className='bg-stone-100 dark:bg-stone-700 rounded-md py-1 px-2'>{user.username}</span>
        </div>

        <div className='flex flex-col gap-1'>
          <label>{locale('auth.email')}</label>
          <span className='bg-stone-100 dark:bg-stone-700 rounded-md py-1 px-2'>{user.email || '-'}</span>
        </div>
      </div>

      <button
        className='border border-red-500 text-red-500 p-2 w-[36rem] rounded-md hover:border-red-300 hover:text-red-300'
        onClick={deleteAccount}
      >
        {locale('auth.delete_account')}
      </button>
    </section>
  );
}
