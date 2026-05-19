import { BROWSER } from 'esm-env';
import i18next from 'i18next';

export const supportedLocales = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
] as const;

export type SupportedLocale = (typeof supportedLocales)[number]['code'];

let locale = $state<SupportedLocale>('en');

const isSupportedLocale = (value: string): value is SupportedLocale => {
  return supportedLocales.some(({ code }) => code === value);
};

export const normalizeLocale = (value?: string): SupportedLocale => {
  if (!value) return 'en';

  const language = value.toLowerCase();
  if (language === 'zh' || language.startsWith('zh-')) return 'zh';
  if (isSupportedLocale(language)) return language;

  return 'en';
};

const setDocumentLanguage = (value: SupportedLocale) => {
  if (BROWSER) document.documentElement.lang = value;
};

export const currentLocale = {
  get value() {
    return locale;
  },
};

export const syncLocaleWithI18next = (): SupportedLocale => {
  locale = normalizeLocale(i18next.resolvedLanguage ?? i18next.language);
  setDocumentLanguage(locale);
  return locale;
};

export const changeLocale = async (
  nextLocale: SupportedLocale,
): Promise<SupportedLocale> => {
  await i18next.changeLanguage(nextLocale);
  locale = nextLocale;
  setDocumentLanguage(nextLocale);

  if (BROWSER) {
    try {
      localStorage.setItem('locale', nextLocale);
    } catch {
      return nextLocale;
    }
  }

  return nextLocale;
};
