<script lang="ts">
  import { Card } from '$lib/components/ui';
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    subtitle?: string;
    children: Snippet;
    footer?: Snippet;
  }

  let { title, subtitle, children, footer }: Props = $props();
</script>

<div class="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
  <Card hover={false} class="w-full max-w-md">
    <div class="text-center mb-6">
      <h1 class="heading-2 text-text-primary">{title}</h1>
      {#if subtitle}
        <p class="text-body text-text-secondary mt-2">{subtitle}</p>
      {/if}
    </div>

    {@render children()}

    {#if footer}
      <div class="mt-6 pt-6 border-t border-border text-center">
        {@render footer()}
      </div>
    {/if}
  </Card>
</div>
