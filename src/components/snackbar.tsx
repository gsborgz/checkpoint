'use client'

import { useContext } from 'react';
import { SnackbarContext } from '@/providers/snackbar';

export enum SnackbarTheme {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Normal = 'normal',
}

export default function Snackbar() {
  const { openSnackbar, snackbarTheme, snackbarText } = useContext(SnackbarContext);
  const themes = {
    [SnackbarTheme.Success]: 'bg-green-500 text-white',
    [SnackbarTheme.Error]: 'bg-red-500 text-white',
    [SnackbarTheme.Warning]: 'bg-yellow-500 text-white',
    [SnackbarTheme.Info]: 'bg-blue-500 text-white',
    [SnackbarTheme.Normal]: 'bg-stone-950 text-stone-300',
  };

  if (!openSnackbar) {
    return null;
  }
  
  return (
    <div className='fixed bottom-4 right-4 flex gap-4'>
      <div className={`${themes[snackbarTheme]} p-4 rounded-md`}>
        {snackbarText}
      </div>
    </div>
  );
}