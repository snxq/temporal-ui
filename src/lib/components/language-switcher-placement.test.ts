import i18next from 'i18next';
import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { syncLocaleWithI18next } from '$lib/i18n/locale.svelte';

import BottomNavSettings from './bottom-nav-settings.svelte';

describe('language switcher placement', () => {
  const cleanup: (() => void)[] = [];

  const stubResizeObserver = () => {
    class ResizeObserverMock {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  };

  afterEach(async () => {
    while (cleanup.length > 0) {
      cleanup.pop()?.();
    }

    await i18next.changeLanguage('en');
    syncLocaleWithI18next();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.resetModules();
    document.body.innerHTML = '';
  });

  const renderBottomNavSettings = () => {
    stubResizeObserver();

    const target = document.createElement('div');
    document.body.append(target);

    const component = mount(BottomNavSettings, {
      target,
      props: { open: true },
    });

    cleanup.push(() => unmount(component));
    flushSync();

    return target;
  };

  test('renders the language switcher in desktop top nav', async () => {
    stubResizeObserver();

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('768px'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );

    const { default: TopNav } = await import('./top-nav.svelte');
    const target = document.createElement('div');
    document.body.append(target);

    const component = mount(TopNav, { target });

    cleanup.push(() => unmount(component));
    flushSync();

    const switcher = target.querySelector('[data-testid="language-switcher"]');

    expect(switcher).not.toBeNull();
    expect(switcher?.textContent).toContain('English');
    expect(switcher?.textContent).toContain('中文');
  });

  test('renders the language switcher in mobile settings', () => {
    const target = renderBottomNavSettings();
    const switcher = target.querySelector('[data-testid="language-switcher"]');

    expect(switcher).not.toBeNull();
    expect(switcher?.textContent).toContain('English');
    expect(switcher?.textContent).toContain('中文');
  });
});
