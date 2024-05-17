'use client';

import { createContext, useState } from 'react';
import Snackbar, { SnackbarTheme } from '@/components/snackbar';
import { useLocale } from '@/hooks/locale';

export type SnackbarData = {
  snackbarText: string;
  snackbarTheme: SnackbarTheme;
  openSnackbar: boolean;
  showMessage: (message: string, args?: Record<string, any>, theme?: SnackbarTheme, duration?: number) => void;
  showErrorMessage: (message: string) => void;
};

export const SnackbarContext = createContext({} as SnackbarData);

export default function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState<string>('');
  const [theme, setTheme] = useState<SnackbarTheme>(SnackbarTheme.Normal);
  const [open, setOpen] = useState<boolean>(false);
  const { locale } = useLocale();

  function showMessage(
    key: string,
    args?: Record<string, any>,
    theme: SnackbarTheme = SnackbarTheme.Normal,
    duration: number = 5000,
  ) {
    setText(locale(key, args));
    setTheme(theme);
    setOpen(true);

    setTimeout(() => {
      setOpen(false);
    }, duration);
  }

  function showErrorMessage(message: string) {
    if (message.startsWith('{')) {
      const messageObj = JSON.parse(message);

      if (messageObj?.key) {
        showMessage(messageObj.key, messageObj.args, SnackbarTheme.Error);
      }
    } else {
      // TODO: Retirar log
      console.error(message);
    }
  }

  return (
    <SnackbarContext.Provider
      value={{
        snackbarText: text,
        snackbarTheme: theme,
        openSnackbar: open,
        showMessage,
        showErrorMessage,
      }}
    >
      {children}
      <Snackbar />
    </SnackbarContext.Provider>
  );
}
