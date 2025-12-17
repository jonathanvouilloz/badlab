<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'default' | 'lg';
    children: Snippet;
    header?: Snippet;
    footer?: Snippet;
  }

  let {
    class: className = '',
    hover = true,
    padding = 'default',
    children,
    header,
    footer
  }: Props = $props();

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  const cardStyles = cn(
    'bg-white border border-border rounded-xl',
    'transition-all duration-200',
    hover && 'hover:border-accent hover:shadow-md',
    className
  );
</script>

<div class={cardStyles}>
  {#if header}
    <div class="px-6 py-4 border-b border-border">
      {@render header()}
    </div>
  {/if}

  <div class={paddingStyles[padding]}>
    {@render children()}
  </div>

  {#if footer}
    <div class="px-6 py-4 border-t border-border bg-bg-secondary rounded-b-xl">
      {@render footer()}
    </div>
  {/if}
</div>
