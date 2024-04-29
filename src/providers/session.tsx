'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { createContext } from 'react';
import { User, UserLanguage, UserTheme } from '@prisma/client';
import { usePathname, redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface NextAuthSessionProviderProps {
  children: ReactNode;
}

export default function NextAuthSessionProvider({ children }: NextAuthSessionProviderProps) {
  return (
    <SessionProvider basePath='api/v1/auth'>
      <AppSessionProvider>{children}</AppSessionProvider>
    </SessionProvider>
  );
}

export type SessionData = {
  user: User | null;
  language: UserLanguage;
  theme: UserTheme;
  changeLanguage: (language: UserLanguage) => void;
  changeTheme: (theme: UserTheme) => void;
};

export const SessionContext = createContext({} as SessionData);

function AppSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<UserLanguage>(UserLanguage.PTBR);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const signinSignupRoutes = ['/signin', '/signup'];
  const pathname = usePathname();
  const session = useSession();

  if (loading && session.status !== 'loading') {
    setLoading(false);

    return <h1>Loading...</h1>;
  }

  if (session.status === 'unauthenticated' && !signinSignupRoutes.includes(pathname)) {
    setUser(null);
    redirect('/signin');
  }

  if (session.status === 'authenticated' && !user) {
    const sessionUser = session.data as unknown as User;

    setUser(sessionUser);
    setLanguage(sessionUser.language);
    setTheme(sessionUser.theme.toLocaleLowerCase());
  }

  async function setUserLanguage(newLanguage: UserLanguage) {
    await fetch('api/v1/auth/language', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: newLanguage }),
    });
  }

  async function setUserTheme(newTheme: UserTheme) {
    await fetch('api/v1/auth/theme', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: newTheme }),
    });
  }

  function changeLanguage(newLanguage: UserLanguage) {
    setLanguage(newLanguage);

    if (user) {
      setUserLanguage(newLanguage);
    }
  }

  function changeTheme(newTheme: UserTheme): void {
    setTheme(newTheme.toLocaleLowerCase());

    if (user) {
      setUserTheme(newTheme);
    }
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        language,
        theme: theme as UserTheme,
        changeLanguage,
        changeTheme,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
