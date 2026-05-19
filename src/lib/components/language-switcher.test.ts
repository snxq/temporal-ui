import i18next from 'i18next';
import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';

import type { SupportedLocale } from '$lib/i18n/locale.svelte';
import {
  changeLocale,
  currentLocale,
  syncLocaleWithI18next,
} from '$lib/i18n/locale.svelte';

import LanguageSwitcher from './language-switcher.svelte';

describe('language-switcher', () => {
  const cleanup: (() => void)[] = [];

  afterEach(async () => {
    while (cleanup.length > 0) {
      cleanup.pop()?.();
    }

    await i18next.changeLanguage('en');
    syncLocaleWithI18next();
    document.body.innerHTML = '';
  });

  const waitForLocale = async (locale: SupportedLocale) => {
    await vi.waitFor(() => expect(currentLocale.value).toBe(locale));
  };

  const renderComponent = () => {
    const target = document.createElement('div');
    document.body.append(target);

    const component = mount(LanguageSwitcher, {
      target,
    });

    cleanup.push(() => unmount(component));
    flushSync();

    return {
      target,
      root: target.querySelector('[data-testid="language-switcher"]'),
      englishButton: target.querySelector(
        '[data-testid="language-switcher-en"]',
      ),
      chineseButton: target.querySelector(
        '[data-testid="language-switcher-zh"]',
      ),
    };
  };

  test('renders English and 中文 options', async () => {
    await i18next.changeLanguage('en');
    syncLocaleWithI18next();

    const { root, englishButton, chineseButton } = renderComponent();

    expect(root).not.toBeNull();
    expect(root?.getAttribute('role')).toBe('group');
    expect(root?.getAttribute('aria-label')).toBe('Language switcher');
    expect(englishButton?.textContent).toContain('English');
    expect(chineseButton?.textContent).toContain('中文');
  });

  test('reflects the active locale and updates when locale changes', async () => {
    await i18next.changeLanguage('en');
    syncLocaleWithI18next();

    const { englishButton, chineseButton } = renderComponent();

    expect(currentLocale.value).toBe('en');
    expect(englishButton?.getAttribute('aria-pressed')).toBe('true');
    expect(chineseButton?.getAttribute('aria-pressed')).toBe('false');

    await changeLocale('zh');
    flushSync();

    expect(currentLocale.value).toBe('zh');
    expect(englishButton?.getAttribute('aria-pressed')).toBe('false');
    expect(chineseButton?.getAttribute('aria-pressed')).toBe('true');
  });

  test('changes locale to zh when clicking the 中文 button', async () => {
    await i18next.changeLanguage('en');
    syncLocaleWithI18next();

    const { englishButton, chineseButton } = renderComponent();

    expect(chineseButton).not.toBeNull();

    chineseButton?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    await waitForLocale('zh');
    flushSync();

    expect(currentLocale.value).toBe('zh');
    expect(englishButton?.getAttribute('aria-pressed')).toBe('false');
    expect(chineseButton?.getAttribute('aria-pressed')).toBe('true');
  });
});
