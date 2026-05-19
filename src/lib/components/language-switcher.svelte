<script lang="ts">
  import ToggleButton from '$lib/holocene/toggle-button/toggle-button.svelte';
  import ToggleButtons from '$lib/holocene/toggle-button/toggle-buttons.svelte';
  import type { SupportedLocale } from '$lib/i18n/locale.svelte';
  import {
    changeLocale,
    currentLocale,
    supportedLocales,
  } from '$lib/i18n/locale.svelte';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();

  const selectLocale = async (locale: SupportedLocale) => {
    await changeLocale(locale);
  };
</script>

<ToggleButtons
  data-testid="language-switcher"
  class={className}
  aria-label="Language switcher"
  role="group"
>
  {#each supportedLocales as locale (locale.code)}
    <ToggleButton
      aria-label={`Switch language to ${locale.label}`}
      aria-pressed={currentLocale.value === locale.code}
      data-testid={`language-switcher-${locale.code}`}
      on:click={() => selectLocale(locale.code)}
      active={currentLocale.value === locale.code}
      size="xs"
    >
      {locale.label}
    </ToggleButton>
  {/each}
</ToggleButtons>
