import { t } from 'i18next';

import type { I18nKey, I18nReplace, I18nResources } from '.';

import { currentLocale } from './locale.svelte';

const translateGeneric = <R>(
  key: I18nKey<R>,
  replace: I18nReplace = {},
): string => {
  const _locale = currentLocale.value;

  const [namespace, ...keys] = key.split('.');

  if (!namespace || keys.length === 0) {
    return key;
  }

  const k = keys.join('.');
  return t(`${namespace}:${k}`, replace);
};

export const createTranslate = <R>() => {
  return translateGeneric<R>;
};

export const translate = createTranslate<I18nResources>();
