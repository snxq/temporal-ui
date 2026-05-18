# Chinese Localization Design

## Goal

Add Simplified Chinese support to Temporal UI while keeping the implementation as upstream-friendly as practical. The first implementation round covers existing i18n keys only, uses browser language detection for first load, and provides a visible top-level language switcher.

## Scope

### Included in the first round

- Add a `zh` Simplified Chinese locale that mirrors every namespace and key currently present under `src/lib/i18n/locales/en`.
- Register `zh` in the existing i18next resource map.
- Keep English as the fallback language.
- Preserve the existing detection order: query string, local storage, then browser language.
- Add a visible language switcher in the top navigation area.
- Store manual language selection in the existing `localStorage.locale` key.
- Update or add tests that verify locale registration, key parity, and language switching behavior.

### Deferred to later rounds

- Broad hardcoded-English cleanup outside existing i18n keys.
- Full date, relative time, and number formatting localization.
- Traditional Chinese or regional Chinese variants.
- Translation management service integration.

## Architecture

The existing i18n structure is retained. Chinese resources are added as a sibling locale to English:

```text
src/lib/i18n/locales/
  en/
    common.ts
    workflows.ts
    ...
  zh/
    common.ts
    workflows.ts
    ...
```

`src/lib/i18n/locales/zh/index.ts` exports a `ZH` locale constant and a `SimplifiedChinese` resource object with the same namespace structure as `English`. `src/lib/i18n/locales/index.ts` registers both locales:

```ts
export default {
  [EN]: English,
  [ZH]: SimplifiedChinese,
};
```

The existing i18next configuration remains largely unchanged:

- `fallbackLng: 'en'`
- `load: 'languageOnly'`
- `lookupQuerystring: 'lng'`
- `lookupLocalStorage: 'locale'`

With `load: 'languageOnly'`, browser values such as `zh-CN` and `zh-Hans` resolve to the `zh` resource.

## Language Switcher

A top-level language switcher is added to the existing top navigation surface. It should reuse existing Holocene menu or button components and avoid private-only styling.

The switcher shows the current language and offers:

- English
- 中文

Selecting a language calls `i18next.changeLanguage('en' | 'zh')` and persists the choice to `localStorage.locale`. The visible UI should update without a full page reload. If existing direct `translate(...)` calls do not rerender consistently after language changes, introduce the smallest reactive wrapper or store needed to make language changes observable in Svelte.

The document language should also track the selected language by setting `document.documentElement.lang` to `en` or `zh`.

## Translation Strategy

Generic UI text should be concise Chinese:

- Save → 保存
- Cancel → 取消
- Search → 搜索
- Loading... → 加载中...

Core Temporal concepts use Chinese-first bilingual wording when recognition matters:

- Workflow → 工作流 Workflow
- Namespace → 命名空间 Namespace
- Task Queue → 任务队列 Task Queue
- Activity → 活动 Activity
- Schedule → 调度 Schedule
- Worker → Worker or 工作进程 Worker, depending on context

Technical product names and identifiers should usually remain English or bilingual:

- API
- JSON
- ID, Run ID, Build ID
- Codec Server
- Nexus

Translations should prioritize accuracy, engineering readability, and consistency over literary wording.

## Data Flow

1. On first load, i18next detects the language from `?lng`, `localStorage.locale`, or the browser.
2. If the detected language is Chinese, i18next loads the `zh` resource through `load: 'languageOnly'`.
3. If a key is missing, i18next falls back to English.
4. When the user chooses a language in the top switcher, the app calls `changeLanguage`, persists the selected language, updates `<html lang>`, and rerenders translated text.

## Error Handling

Missing Chinese translations should not break the UI because English remains the fallback. Tests should make missing keys visible during development by comparing the `en` and `zh` resource key trees.

The language switcher should not fail if local storage is unavailable. In that case, language changes can still apply in memory for the current session.

## Testing

Add tests for:

- `zh` is present in the exported locale resources.
- `en` and `zh` have the same namespace and key structure.
- The language switcher calls `i18next.changeLanguage` with the selected locale.
- Manual selection stores the locale under `localStorage.locale`.

Run the normal project verification after implementation:

```bash
pnpm lint
pnpm check
pnpm test -- --run
```

## Rollout Plan

1. Add Chinese locale files by mirroring the existing English namespace files.
2. Register `zh` and add key parity tests.
3. Add the top-level language switcher.
4. Verify browser detection, `?lng=zh`, and manual switching.
5. Defer hardcoded-English cleanup and locale-aware date/number formatting to follow-up work.
