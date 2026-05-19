import { beforeEach, describe, expect, it, vi } from 'vitest';

const { initMock, syncLocaleWithI18next, useMock } = vi.hoisted(() => {
  const initMock = vi.fn();
  const syncLocaleWithI18next = vi.fn();
  const useMock = vi.fn(() => ({ init: initMock }));

  return { initMock, syncLocaleWithI18next, useMock };
});

vi.mock('i18next', () => ({
  default: {
    use: useMock,
  },
}));

vi.mock('$lib/i18n/locale.svelte', () => ({
  syncLocaleWithI18next,
}));

vi.mock('i18next-browser-languagedetector', () => ({
  default: {},
}));

import { load } from './+layout';

describe('+layout i18n init', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('waits for i18next init before syncing the detected locale', async () => {
    let resolveInit: () => void;
    const initPromise = new Promise<void>((resolve) => {
      resolveInit = resolve;
    });
    initMock.mockReturnValueOnce(initPromise);

    let settled = false;
    const loadPromise = load({} as never).then(() => {
      settled = true;
    });

    await Promise.resolve();

    expect(useMock).toHaveBeenCalledOnce();
    expect(initMock).toHaveBeenCalledOnce();
    expect(settled).toBe(false);
    expect(syncLocaleWithI18next).not.toHaveBeenCalled();
    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackLng: 'en',
        load: 'languageOnly',
        defaultNS: 'common',
        detection: expect.objectContaining({
          order: ['querystring', 'localStorage', 'navigator'],
          caches: ['localStorage'],
          lookupQuerystring: 'lng',
          lookupLocalStorage: 'locale',
        }),
      }),
    );

    resolveInit!();
    await loadPromise;

    expect(syncLocaleWithI18next).toHaveBeenCalledOnce();
  });
});
