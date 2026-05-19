import i18next from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  changeLocale,
  currentLocale,
  normalizeLocale,
  syncLocaleWithI18next,
} from './locale.svelte';

describe('locale state', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.lang = 'en';
    Object.defineProperty(i18next, 'resolvedLanguage', {
      configurable: true,
      value: 'en',
    });
    syncLocaleWithI18next();
  });

  it('normalizes Chinese browser locales to zh', () => {
    expect(normalizeLocale('zh-CN')).toBe('zh');
    expect(normalizeLocale('zh-Hans')).toBe('zh');
    expect(normalizeLocale('zh')).toBe('zh');
  });

  it('falls back unsupported locales to en', () => {
    expect(normalizeLocale('fr-FR')).toBe('en');
    expect(normalizeLocale(undefined)).toBe('en');
  });

  it('syncs the active locale and document language from i18next', () => {
    Object.defineProperty(i18next, 'resolvedLanguage', {
      configurable: true,
      value: 'zh-CN',
    });

    const locale = syncLocaleWithI18next();

    expect(locale).toBe('zh');
    expect(currentLocale.value).toBe('zh');
    expect(document.documentElement.lang).toBe('zh');
  });

  it('changes language and persists the selected locale', async () => {
    const changeLanguage = vi
      .spyOn(i18next, 'changeLanguage')
      .mockResolvedValue(i18next.t);

    await changeLocale('zh');

    expect(changeLanguage).toHaveBeenCalledWith('zh');
    expect(currentLocale.value).toBe('zh');
    expect(document.documentElement.lang).toBe('zh');
    expect(localStorage.getItem('locale')).toBe('zh');
  });

  it('keeps the in-memory language change when localStorage fails', async () => {
    vi.spyOn(i18next, 'changeLanguage').mockResolvedValue(i18next.t);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    await expect(changeLocale('zh')).resolves.toBe('zh');

    expect(currentLocale.value).toBe('zh');
    expect(document.documentElement.lang).toBe('zh');
  });
});
