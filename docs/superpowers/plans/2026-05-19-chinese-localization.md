# Chinese Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Simplified Chinese support to Temporal UI with browser detection, manual language switching, reactive UI updates, and desktop/mobile language entry points.

**Architecture:** Keep the existing i18next resource model and add a `zh` locale that mirrors `en`. Add a small Svelte 5 rune-backed locale module so every `translate(...)` call can depend on the active locale without rewriting hundreds of call sites. Reuse one `LanguageSwitcher` component in desktop `TopNav` and mobile settings.

**Tech Stack:** SvelteKit, Svelte 5 runes, TypeScript, i18next, i18next-browser-languagedetector, Vitest with jsdom, Holocene toggle buttons.

---

## File Structure

### Create

- `src/lib/i18n/locale.svelte.ts` — active locale state, locale normalization, `changeLocale`, document language sync, storage persistence.
- `src/lib/i18n/locale.test.ts` — unit tests for locale normalization, language changes, `<html lang>`, and storage failure behavior.
- `src/lib/i18n/locales.test.ts` — resource registration, key parity, and representative Chinese translation tests.
- `src/lib/i18n/locales/zh/activities.ts`
- `src/lib/i18n/locales/zh/batch.ts`
- `src/lib/i18n/locales/zh/codec-server.ts`
- `src/lib/i18n/locales/zh/common.ts`
- `src/lib/i18n/locales/zh/data-encoder.ts`
- `src/lib/i18n/locales/zh/date-picker.ts`
- `src/lib/i18n/locales/zh/deployments.ts`
- `src/lib/i18n/locales/zh/events.ts`
- `src/lib/i18n/locales/zh/index.ts`
- `src/lib/i18n/locales/zh/namespaces.ts`
- `src/lib/i18n/locales/zh/nexus.ts`
- `src/lib/i18n/locales/zh/schedules.ts`
- `src/lib/i18n/locales/zh/search-attributes.ts`
- `src/lib/i18n/locales/zh/standalone-activities.ts`
- `src/lib/i18n/locales/zh/typed-errors.ts`
- `src/lib/i18n/locales/zh/workers.ts`
- `src/lib/i18n/locales/zh/workflows.ts`
- `src/lib/i18n/translated-label.test.svelte` — minimal component used by the reactivity test.
- `src/lib/i18n/translate.reactivity.test.ts` — verifies visible text rerenders after language changes.
- `src/lib/components/language-switcher.svelte` — shared desktop/mobile language switcher.
- `src/lib/components/language-switcher.test.ts` — component tests for labels and click behavior.
- `src/lib/components/language-switcher-placement.test.ts` — verifies desktop and mobile entry points expose locale options.
- `src/routes/+layout.i18n.test.ts` — verifies the root layout syncs locale state after i18next detection.

### Modify

- `src/lib/i18n/locales/index.ts` — register `zh` resources.
- `src/lib/i18n/translate.ts` — read active locale state so direct `translate(...)` calls rerender in Svelte.
- `src/routes/+layout.ts` — await i18next initialization and sync locale state after browser detection.
- `vitest-setup.ts` — sync locale state after test i18next initialization.
- `src/lib/components/top-nav.svelte` — add desktop language switcher.
- `src/lib/components/bottom-nav-settings.svelte` — add mobile settings language switcher.

---

## Task 1: Locale State Module

**Files:**

- Create: `src/lib/i18n/locale.svelte.ts`
- Create: `src/lib/i18n/locale.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/i18n/locale.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
pnpm test -- --run src/lib/i18n/locale.test.ts
```

Expected: FAIL because `src/lib/i18n/locale.svelte.ts` does not exist.

- [ ] **Step 3: Write the minimal implementation**

Create `src/lib/i18n/locale.svelte.ts`:

```ts
import i18next from 'i18next';

import { BROWSER } from 'esm-env';

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
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
pnpm test -- --run src/lib/i18n/locale.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/lib/i18n/locale.svelte.ts src/lib/i18n/locale.test.ts
git commit -m "$(cat <<'EOF'
Add locale state management
EOF
)"
```

---

## Task 2: Chinese Locale Resources

**Files:**

- Create: every file under `src/lib/i18n/locales/zh/`
- Create: `src/lib/i18n/locales.test.ts`
- Modify: `src/lib/i18n/locales/index.ts`

- [ ] **Step 1: Write the failing resource tests**

Create `src/lib/i18n/locales.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import type { I18nResources } from '.';
import resources from './locales';

type Dictionary = Record<string, unknown>;

const flattenKeys = (value: unknown, prefix = ''): string[] => {
  if (!value || typeof value !== 'object') return [prefix];

  return Object.entries(value as Dictionary).flatMap(([key, child]) => {
    const childPrefix = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object')
      return flattenKeys(child, childPrefix);
    return [childPrefix];
  });
};

describe('locale resources', () => {
  const locales = resources as Record<string, I18nResources>;

  it('registers Simplified Chinese resources', () => {
    expect(locales.zh).toBeDefined();
  });

  it('keeps zh keys in parity with en keys', () => {
    expect(flattenKeys(locales.zh).sort()).toEqual(
      flattenKeys(locales.en).sort(),
    );
  });

  it('uses Simplified Chinese for representative labels', () => {
    expect(locales.zh.common.save).toBe('保存');
    expect(locales.zh.common.cancel).toBe('取消');
    expect(locales.zh.namespaces.namespace).toBe('命名空间 Namespace');
    expect(locales.zh.workflows['back-to-workflows']).toBe(
      '返回工作流 Workflow',
    );
    expect(locales.zh.workers['task-queue']).toBe('任务队列 Task Queue');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
pnpm test -- --run src/lib/i18n/locales.test.ts
```

Expected: FAIL because `resources.zh` is undefined.

- [ ] **Step 3: Generate zh locale files from the English structure**

Run:

```bash
mkdir -p src/lib/i18n/locales/zh && cp src/lib/i18n/locales/en/*.ts src/lib/i18n/locales/zh/
```

- [ ] **Step 4: Replace the generated zh index file**

Replace `src/lib/i18n/locales/zh/index.ts` with:

```ts
import * as Activities from './activities';
import * as Batch from './batch';
import * as CodecServer from './codec-server';
import * as Common from './common';
import * as DataEncoder from './data-encoder';
import * as DatePicker from './date-picker';
import * as Deployments from './deployments';
import * as Events from './events';
import * as Namespaces from './namespaces';
import * as Nexus from './nexus';
import * as Schedules from './schedules';
import * as SearchAttributes from './search-attributes';
import * as StandaloneActivities from './standalone-activities';
import * as TypedErrors from './typed-errors';
import * as Workers from './workers';
import * as Workflows from './workflows';

export const ZH = 'zh' as const;

export const SimplifiedChinese = {
  [Activities.Namespace]: Activities.Strings,
  [Batch.Namespace]: Batch.Strings,
  [CodecServer.Namespace]: CodecServer.Strings,
  [Common.Namespace]: Common.Strings,
  [DatePicker.Namespace]: DatePicker.Strings,
  [Deployments.Namespace]: Deployments.Strings,
  [Workflows.Namespace]: Workflows.Strings,
  [TypedErrors.Namespace]: TypedErrors.Strings,
  [Events.Namespace]: Events.Strings,
  [Schedules.Namespace]: Schedules.Strings,
  [DataEncoder.Namespace]: DataEncoder.Strings,
  [Namespaces.Namespace]: Namespaces.Strings,
  [Nexus.Namespace]: Nexus.Strings,
  [SearchAttributes.Namespace]: SearchAttributes.Strings,
  [StandaloneActivities.Namespace]: StandaloneActivities.Strings,
  [Workers.Namespace]: Workers.Strings,
} as const;
```

- [ ] **Step 5: Register zh resources**

Replace `src/lib/i18n/locales/index.ts` with:

```ts
import { EN, English } from './en';
import { SimplifiedChinese, ZH } from './zh';

export default {
  [EN]: English,
  [ZH]: SimplifiedChinese,
};
```

- [ ] **Step 6: Translate the zh resource values**

Edit every `Strings` object in `src/lib/i18n/locales/zh/*.ts` except `index.ts`.

Keep these unchanged:

- Object keys.
- `Namespace` constants.
- Interpolation tokens such as `{{count}}`, `{{identity}}`, `{{namespace}}`, `{{action}}`, and `{{placeholder}}`.
- ICU number formatting fragments such as `{{count, number}}`.
- Pseudo-markup placeholders such as `<1></1>` and `<2></2>`.
- Technical identifiers where Chinese would reduce clarity: `API`, `JSON`, `ID`, `Run ID`, `Build ID`, `Codec Server`, `Nexus`, SDK names, and config property names.

Use these required representative translations:

- `src/lib/i18n/locales/zh/common.ts`
  - `save: '保存'`
  - `cancel: '取消'`
  - `search: '搜索'`
  - `loading: '加载中...'`
  - `workflows: '工作流 Workflow'`
  - `namespaces: '命名空间 Namespace'`
- `src/lib/i18n/locales/zh/namespaces.ts`
  - `namespace: '命名空间 Namespace'`
- `src/lib/i18n/locales/zh/workflows.ts`
  - `'back-to-workflows': '返回工作流 Workflow'`
- `src/lib/i18n/locales/zh/workers.ts`
  - `'task-queue': '任务队列 Task Queue'`

Use this terminology policy throughout the rest of the zh files:

- Workflow → 工作流 Workflow
- Namespace → 命名空间 Namespace
- Task Queue → 任务队列 Task Queue
- Activity → 活动 Activity
- Schedule → 调度 Schedule
- Worker → Worker, or 工作进程 Worker when the context describes the running process
- Poller → Poller
- Deployment → 部署 Deployment
- Version → 版本 Version
- Search Attributes → 搜索属性 Search Attributes
- Payload → Payload

- [ ] **Step 7: Run tests to verify they pass**

Run:

```bash
pnpm test -- --run src/lib/i18n/locales.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit**

Run:

```bash
git add src/lib/i18n/locales/index.ts src/lib/i18n/locales.test.ts src/lib/i18n/locales/zh
git commit -m "$(cat <<'EOF'
Add Simplified Chinese locale resources
EOF
)"
```

---

## Task 3: Sync Locale After i18next Detection

**Files:**

- Create: `src/routes/+layout.i18n.test.ts`
- Modify: `src/routes/+layout.ts`
- Modify: `vitest-setup.ts`

- [ ] **Step 1: Write the failing layout test**

Create `src/routes/+layout.i18n.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const init = vi.fn().mockResolvedValue(undefined);
  return {
    init,
    use: vi.fn(() => ({ init })),
    syncLocaleWithI18next: vi.fn(),
  };
});

vi.mock('i18next', () => ({
  default: {
    use: mocks.use,
  },
}));

vi.mock('i18next-browser-languagedetector', () => ({
  default: vi.fn(),
}));

vi.mock('$lib/i18n/locale.svelte', () => ({
  syncLocaleWithI18next: mocks.syncLocaleWithI18next,
}));

describe('root layout i18n initialization', () => {
  it('syncs locale state after i18next initializes', async () => {
    const { load } = await import('./+layout');

    await load({} as never);

    expect(mocks.init).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackLng: 'en',
        load: 'languageOnly',
        detection: expect.objectContaining({
          lookupQuerystring: 'lng',
          lookupLocalStorage: 'locale',
        }),
      }),
    );
    expect(mocks.syncLocaleWithI18next).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm test -- --run src/routes/+layout.i18n.test.ts
```

Expected: FAIL because the layout does not call `syncLocaleWithI18next`.

- [ ] **Step 3: Replace the layout initialization**

Replace `src/routes/+layout.ts` with:

```ts
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import type { LayoutData, LayoutLoad } from './$types';

import { i18nNamespaces } from '$lib/i18n';
import { syncLocaleWithI18next } from '$lib/i18n/locale.svelte';
import resources from '$lib/i18n/locales';

export const ssr = false;

export const load: LayoutLoad = async function (): Promise<LayoutData> {
  await i18next.use(LanguageDetector).init({
    fallbackLng: 'en',
    load: 'languageOnly',
    ns: i18nNamespaces,
    defaultNS: 'common',
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'locale',
    },
    resources,
  });

  syncLocaleWithI18next();
};
```

- [ ] **Step 4: Sync locale state in Vitest setup**

Modify `vitest-setup.ts` so it imports and calls `syncLocaleWithI18next` after `i18next.init`:

```ts
import i18next from 'i18next';
import { vi } from 'vitest';

import { i18nNamespaces } from './src/lib/i18n';
import { syncLocaleWithI18next } from './src/lib/i18n/locale.svelte';
import resources from './src/lib/i18n/locales';

i18next.init({
  fallbackLng: 'en',
  load: 'languageOnly',
  ns: i18nNamespaces,
  defaultNS: 'common',
  detection: {
    order: ['querystring', 'localStorage', 'navigator'],
    caches: ['localStorage'],
    lookupQuerystring: 'lng',
    lookupLocalStorage: 'locale',
  },
  resources,
});

syncLocaleWithI18next();

const BroadcastChannelMock = vi.fn(() => ({
  addEventListener: () => {},
  postMessage: () => {},
}));

vi.stubGlobal('BroadcastChannel', BroadcastChannelMock);

const cryptoMock = {
  randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(2, 9),
};

vi.stubGlobal('crypto', cryptoMock);

vi.mock('esm-env', () => {
  const BROWSER = true;
  const DEV = false;
  return { BROWSER, DEV };
});
```

- [ ] **Step 5: Run tests to verify they pass**

Run:

```bash
pnpm test -- --run src/routes/+layout.i18n.test.ts src/lib/i18n/locale.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/routes/+layout.ts src/routes/+layout.i18n.test.ts vitest-setup.ts
git commit -m "$(cat <<'EOF'
Sync locale after i18next initialization
EOF
)"
```

---

## Task 4: Reactive Translation Calls

**Files:**

- Create: `src/lib/i18n/translated-label.test.svelte`
- Create: `src/lib/i18n/translate.reactivity.test.ts`
- Modify: `src/lib/i18n/translate.ts`

- [ ] **Step 1: Create the test fixture component**

Create `src/lib/i18n/translated-label.test.svelte`:

```svelte
<script lang="ts">
  import { translate } from './translate';
</script>

<p>{translate('common.save')}</p>
```

- [ ] **Step 2: Write the failing reactivity test**

Create `src/lib/i18n/translate.reactivity.test.ts`:

```ts
import i18next from 'i18next';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { flushSync, mount, unmount } from 'svelte';

import { changeLocale, syncLocaleWithI18next } from './locale.svelte';
import TranslatedLabel from './translated-label.test.svelte';

describe('reactive translate', () => {
  let target: HTMLDivElement;
  let component: Record<string, never>;

  beforeEach(async () => {
    localStorage.clear();
    document.body.innerHTML = '';
    target = document.createElement('div');
    document.body.append(target);
    await i18next.changeLanguage('en');
    syncLocaleWithI18next();
  });

  afterEach(() => {
    if (component) unmount(component);
    target.remove();
  });

  it('rerenders visible text after changing language', async () => {
    component = mount(TranslatedLabel, { target });
    flushSync();

    expect(target.textContent).toContain('Save');

    await changeLocale('zh');
    flushSync();

    expect(target.textContent).toContain('保存');
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run:

```bash
pnpm test -- --run src/lib/i18n/translate.reactivity.test.ts
```

Expected: FAIL because changing `currentLocale` does not yet make `translate(...)` calls rerender.

- [ ] **Step 4: Make `translate(...)` depend on the active locale**

Replace `src/lib/i18n/translate.ts` with:

```ts
import { t } from 'i18next';

import type { I18nKey, I18nReplace, I18nResources } from '.';

import { currentLocale } from './locale.svelte';

const translateGeneric = <R>(
  key: I18nKey<R>,
  replace: I18nReplace = {},
): string => {
  currentLocale.value;

  const [namespace, ...keys] = key.split('.');

  if (namespace && keys.length > 0) {
    const k = keys.join('.');
    return t(`${namespace}:${k}`, replace);
  }

  return key;
};

export const createTranslate = <R>() => {
  return translateGeneric<R>;
};

export const translate = createTranslate<I18nResources>();
```

- [ ] **Step 5: Run focused translation tests**

Run:

```bash
pnpm test -- --run src/lib/i18n/translate.reactivity.test.ts src/lib/i18n/translate.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/lib/i18n/translated-label.test.svelte src/lib/i18n/translate.reactivity.test.ts src/lib/i18n/translate.ts
git commit -m "$(cat <<'EOF'
Make translations reactive to locale changes
EOF
)"
```

---

## Task 5: Shared Language Switcher Component

**Files:**

- Create: `src/lib/components/language-switcher.svelte`
- Create: `src/lib/components/language-switcher.test.ts`

- [ ] **Step 1: Write the failing component tests**

Create `src/lib/components/language-switcher.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';

import { flushSync, mount, unmount } from 'svelte';

import * as locale from '$lib/i18n/locale.svelte';

import LanguageSwitcher from './language-switcher.svelte';

describe('LanguageSwitcher', () => {
  let target: HTMLDivElement;
  let component: Record<string, never>;

  afterEach(() => {
    if (component) unmount(component);
    target?.remove();
    vi.restoreAllMocks();
  });

  const render = () => {
    target = document.createElement('div');
    document.body.append(target);
    component = mount(LanguageSwitcher, { target });
    flushSync();
  };

  it('shows English and Chinese options', () => {
    render();

    expect(target.textContent).toContain('English');
    expect(target.textContent).toContain('中文');
  });

  it('changes language when the Chinese option is selected', () => {
    const changeLocale = vi
      .spyOn(locale, 'changeLocale')
      .mockResolvedValue('zh');

    render();

    const button = target.querySelector(
      '[data-testid="language-switcher-zh"]',
    ) as HTMLButtonElement;
    button.click();
    flushSync();

    expect(changeLocale).toHaveBeenCalledWith('zh');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
pnpm test -- --run src/lib/components/language-switcher.test.ts
```

Expected: FAIL because `language-switcher.svelte` does not exist.

- [ ] **Step 3: Create the component**

Create `src/lib/components/language-switcher.svelte`:

```svelte
<script lang="ts">
  import { type ClassNameValue, twMerge } from 'tailwind-merge';

  import type { ButtonStyles } from '$lib/holocene/button.svelte';
  import ToggleButton from '$lib/holocene/toggle-button/toggle-button.svelte';
  import ToggleButtons from '$lib/holocene/toggle-button/toggle-buttons.svelte';
  import {
    changeLocale,
    currentLocale,
    supportedLocales,
    type SupportedLocale,
  } from '$lib/i18n/locale.svelte';

  interface Props {
    class?: ClassNameValue;
    size?: ButtonStyles['size'];
  }

  let { class: className = '', size = 'xs' }: Props = $props();

  const selectLocale = (locale: SupportedLocale) => {
    void changeLocale(locale);
  };

  const label = $derived(currentLocale.value === 'zh' ? '语言' : 'Language');
</script>

<ToggleButtons
  data-testid="language-switcher"
  aria-label={label}
  class={twMerge('pl-4', className)}
>
  {#each supportedLocales as locale}
    <ToggleButton
      aria-label={locale.label}
      data-testid={`language-switcher-${locale.code}`}
      active={currentLocale.value === locale.code}
      {size}
      on:click={() => selectLocale(locale.code)}
    >
      {locale.label}
    </ToggleButton>
  {/each}
</ToggleButtons>
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
pnpm test -- --run src/lib/components/language-switcher.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/lib/components/language-switcher.svelte src/lib/components/language-switcher.test.ts
git commit -m "$(cat <<'EOF'
Add shared language switcher
EOF
)"
```

---

## Task 6: Desktop and Mobile Language Entry Points

**Files:**

- Create: `src/lib/components/language-switcher-placement.test.ts`
- Modify: `src/lib/components/top-nav.svelte`
- Modify: `src/lib/components/bottom-nav-settings.svelte`

- [ ] **Step 1: Write the failing placement tests**

Create `src/lib/components/language-switcher-placement.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { flushSync, mount, unmount } from 'svelte';

import BottomNavSettings from './bottom-nav-settings.svelte';
import TopNav from './top-nav.svelte';

const setMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe('language switcher placement', () => {
  let target: HTMLDivElement;
  let component: Record<string, never>;

  beforeEach(() => {
    target = document.createElement('div');
    document.body.append(target);
  });

  afterEach(() => {
    if (component) unmount(component);
    target.remove();
    vi.restoreAllMocks();
  });

  it('exposes language options in desktop top navigation', () => {
    setMatchMedia(true);

    component = mount(TopNav, { target });
    flushSync();

    expect(target.querySelector('[data-testid="language-switcher"]')).not.toBe(
      null,
    );
    expect(target.textContent).toContain('English');
    expect(target.textContent).toContain('中文');
  });

  it('exposes language options in mobile settings', () => {
    component = mount(BottomNavSettings, {
      target,
      props: { open: true },
    });
    flushSync();

    expect(target.querySelector('[data-testid="language-switcher"]')).not.toBe(
      null,
    );
    expect(target.textContent).toContain('English');
    expect(target.textContent).toContain('中文');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
pnpm test -- --run src/lib/components/language-switcher-placement.test.ts
```

Expected: FAIL because neither navigation surface renders `LanguageSwitcher` yet.

- [ ] **Step 3: Add desktop switcher to TopNav**

Modify `src/lib/components/top-nav.svelte` so the imports include `LanguageSwitcher`:

```svelte
<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';

  import type { Snippet } from 'svelte';
  import { type ClassNameValue, twMerge as merge } from 'tailwind-merge';

  import DataEncoderStatus from '$lib/components/data-encoder-status.svelte';
  import LanguageSwitcher from '$lib/components/language-switcher.svelte';
  import TimezoneSelect from '$lib/components/timezone-select.svelte';
  import { translate } from '$lib/i18n/translate';

  interface Props {
    class?: ClassNameValue;
    left?: Snippet;
    children?: Snippet;
  }

  let { class: className = '', children, left }: Props = $props();

  const md = new MediaQuery('min-width:768px');
</script>
```

Then update the right-side controls in the same file:

```svelte
<div class="flex items-center gap-2">
  <LanguageSwitcher class="pl-0" />
  <TimezoneSelect />
  <DataEncoderStatus />
  {@render children?.()}
</div>
```

- [ ] **Step 4: Add mobile switcher to BottomNavSettings**

Modify `src/lib/components/bottom-nav-settings.svelte` so the imports include `LanguageSwitcher` and `currentLocale`:

```svelte
<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';

  import DarkModeMenu from '$lib/components/dark-mode-menu.svelte';
  import LanguageSwitcher from '$lib/components/language-switcher.svelte';
  import TimezoneSelect from '$lib/components/timezone-select.svelte';
  import NavigationButton from '$lib/holocene/navigation/navigation-button.svelte';
  import { currentLocale } from '$lib/i18n/locale.svelte';
  import { translate } from '$lib/i18n/translate';
  import { dataEncoder } from '$lib/stores/data-encoder';

  import { viewDataEncoderSettings } from './data-encoder-settings.svelte';
```

Then add this row between the timezone and theme rows:

```svelte
<div class="flex items-center justify-between">
  <p>{currentLocale.value === 'zh' ? '语言' : 'Language'}</p>
  <LanguageSwitcher class="pl-0" />
</div>
```

- [ ] **Step 5: Run placement and switcher tests**

Run:

```bash
pnpm test -- --run src/lib/components/language-switcher-placement.test.ts src/lib/components/language-switcher.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/lib/components/top-nav.svelte src/lib/components/bottom-nav-settings.svelte src/lib/components/language-switcher-placement.test.ts
git commit -m "$(cat <<'EOF'
Add language switcher to navigation
EOF
)"
```

---

## Task 7: Focused Integration Verification

**Files:**

- Verify changes from Tasks 1-6.

- [ ] **Step 1: Run all i18n and language switcher tests**

Run:

```bash
pnpm test -- --run src/lib/i18n/locale.test.ts src/lib/i18n/locales.test.ts src/routes/+layout.i18n.test.ts src/lib/i18n/translate.reactivity.test.ts src/lib/i18n/translate.test.ts src/lib/components/language-switcher.test.ts src/lib/components/language-switcher-placement.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run type checking**

Run:

```bash
pnpm check
```

Expected: PASS with no TypeScript or Svelte diagnostics.

- [ ] **Step 3: Run linting**

Run:

```bash
pnpm lint
```

Expected: PASS with no Prettier, ESLint, or stylelint failures.

- [ ] **Step 4: Run the full unit test suite**

Run:

```bash
pnpm test -- --run
```

Expected: PASS.

- [ ] **Step 5: Resolve verification failures**

If Steps 1-4 require code fixes, make the smallest fix that addresses the failure, rerun the failed command, and commit only the files changed by that fix. Use `git status --short` to identify the exact files and stage them by name. Do not use `git add -A`.

If Steps 1-4 pass without changes, do not create a commit in this step.

---

## Task 8: Browser Verification

**Files:**

- No planned source changes.

- [ ] **Step 1: Start the development server**

Run:

```bash
pnpm dev:local-temporal
```

Expected: Vite starts and prints a local URL.

- [ ] **Step 2: Verify browser-language and query-string behavior**

Open the local URL with `?lng=zh` appended.

Expected:

- The UI shows Chinese text for translated strings such as `保存`, `取消`, or `工作流 Workflow` where those keys are visible.
- The `<html>` element has `lang="zh"`.
- The language switcher shows `English` and `中文`.

- [ ] **Step 3: Verify manual switching**

Click `English` in the language switcher.

Expected:

- Visible translated strings change back to English without a full page reload.
- `localStorage.locale` is `en`.
- The `<html>` element has `lang="en"`.

Click `中文` in the language switcher.

Expected:

- Visible translated strings change to Chinese without a full page reload.
- `localStorage.locale` is `zh`.
- The `<html>` element has `lang="zh"`.

- [ ] **Step 4: Verify mobile entry point**

Resize the browser below `768px` width and open the bottom navigation settings panel.

Expected:

- The language switcher is visible in the mobile settings panel.
- `English` and `中文` are both available.
- Switching language from the mobile panel has the same behavior as desktop.

- [ ] **Step 5: Stop the development server**

Stop the dev server with `Ctrl+C` in the terminal running Vite.

Expected: The process exits cleanly.

---

## Self-Review Checklist

- Spec coverage:
  - `zh` resource registration: Task 2.
  - English fallback and languageOnly behavior: Task 2 and Task 3 preserve existing i18next config.
  - Browser/query/localStorage detection: Task 3 and Task 8.
  - Desktop language switcher: Task 6.
  - Mobile language switcher: Task 6.
  - Manual persistence to `localStorage.locale`: Task 1 and Task 5.
  - Reactive rerender after language switch: Task 4.
  - `<html lang>` updates: Task 1, Task 3, and Task 8.
  - Key parity tests: Task 2.
  - Storage failure behavior: Task 1.
- TDD coverage:
  - Each production module or component has a failing test step before implementation.
  - Each task includes a focused command to verify red and green states.
- Scope control:
  - No hardcoded-English cleanup outside existing touched navigation surfaces.
  - No date, relative time, or number formatting localization in this plan.
  - No Traditional Chinese or regional Chinese variants in this plan.
