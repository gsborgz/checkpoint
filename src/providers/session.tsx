'use client';

import { ReactNode, useEffect } from 'react';
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
  const [language, setLanguage] = useState<UserLanguage>();
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const authRoutes = ['/signin', '/signup'];
  const publicRoutes = ['/status'];
  const pathname = usePathname();
  const session = useSession();

  useEffect(() => {
    const localStorageLanguage = localStorage.getItem('language') as UserLanguage;
    const localStorageTheme = localStorage.getItem('theme') as UserTheme;

    if (localStorageLanguage) {
      setLanguage(localStorageLanguage);
    } else {
      localStorage.setItem('language', UserLanguage.en);
      setLanguage(UserLanguage.en);
    }

    if (localStorageTheme) {
      setTheme(localStorageTheme);
    } else {
      localStorage.setItem('theme', UserTheme.dark);
      setTheme(UserTheme.dark);
    }
  }, []);

  if (loading && session.status !== 'loading') {
    setLoading(false);

    return <h1>Loading...</h1>;
  }

  if (session.status === 'unauthenticated' && !authRoutes.includes(pathname) && !publicRoutes.includes(pathname)) {
    setUser(null);
    redirect('/signin');
  }

  if (session.status === 'authenticated' && !user) {
    const user = session.data.user as User;

    setUser(user);
    setLanguage(user.language);
    setTheme(user.theme.toLocaleLowerCase());
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

    localStorage.setItem('language', newLanguage);

    if (user) {
      setUserLanguage(newLanguage);
      updateSessionUser();
    }
  }

  function changeTheme(newTheme: UserTheme): void {
    setTheme(newTheme);

    localStorage.setItem('theme', newTheme);

    if (user) {
      setUserTheme(newTheme);
      updateSessionUser();
    }
  }

  async function updateSessionUser() {
    await session.update();
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
