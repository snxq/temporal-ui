import i18next from 'i18next';
import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test } from 'vitest';

import { changeLocale, syncLocaleWithI18next } from './locale.svelte';
import Translate from './translate.svelte';

describe('translate.svelte', () => {
  const cleanup: (() => void)[] = [];

  afterEach(async () => {
    while (cleanup.length > 0) {
      cleanup.pop()?.();
    }

    await i18next.changeLanguage('en');
    syncLocaleWithI18next();
    document.body.innerHTML = '';
  });

  test('rerenders translated text when the locale changes without remounting', async () => {
    await i18next.changeLanguage('en');
    syncLocaleWithI18next();

    const target = document.createElement('div');
    document.body.append(target);

    const component = mount(Translate, {
      target,
      props: {
        key: 'common.save',
      },
    });

    cleanup.push(() => unmount(component));

    flushSync();
    expect(target.textContent).toContain('Save');

    await changeLocale('zh');
    flushSync();

    expect(target.textContent).toContain('保存');
  });
});
