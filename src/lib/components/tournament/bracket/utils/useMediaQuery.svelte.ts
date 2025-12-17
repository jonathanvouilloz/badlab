import { browser } from '$app/environment';

/**
 * Svelte 5 rune-based media query hook
 * Returns a reactive object with a `current` property that updates
 * when the media query match state changes
 */
export function useMediaQuery(query: string): { readonly current: boolean } {
  let matches = $state(false);

  $effect(() => {
    if (!browser) return;

    const mediaQuery = window.matchMedia(query);
    matches = mediaQuery.matches;

    function handleChange(e: MediaQueryListEvent) {
      matches = e.matches;
    }

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  });

  return {
    get current() {
      return matches;
    }
  };
}
