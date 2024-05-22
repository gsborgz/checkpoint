'use client';

import * as translations from '@/assets/i18n';
import { useContext } from 'react';
import { SessionContext } from '@/providers/session';

export type LocaleFunction = (keyPath: string, args?: Record<string, any>) => string;

export type DictionaryData = {
  locale: LocaleFunction;
};

export function useLocale(): DictionaryData {
  const { language } = useContext(SessionContext);

  function locale(keyPath: string, args?: Record<string, any>): string {
    const fullPath = keyPath.startsWith('language.') ? keyPath : `${keyPath}.${language}`;

    if (!hasValidPath(fullPath)) {
      return keyPath;
    }

    return getValueByPath(fullPath, args);
  }

  return { locale };
}

function hasValidPath(fullPath: string): boolean {
  const keys = fullPath.split('.');
  let translationsObject = Object.assign({}, translations);
  let isValidPath = true;

  keys.forEach((key) => {
    if (translationsObject && translationsObject[key]) {
      translationsObject = translationsObject[key];
    } else {
      isValidPath = false;
    }
  });

  return isValidPath;
}

function getValueByPath(fullPath: string, args: Record<string, any>): string {
  const keys = fullPath.split('.');
  let translation = Object.assign({}, translations) as any;

  keys.forEach((key) => {
    translation = translation[key];
  });

  if (!args) {
    return translation;
  }

  Object.keys(args).forEach((key) => {
    translation = translation.replace(`{${key}}`, args[key]);
  });

  return translation;
}
