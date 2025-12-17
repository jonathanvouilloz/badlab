<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { Snippet } from 'svelte';

  type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

  interface Props {
    variant?: Variant;
    pulse?: boolean;
    class?: string;
    children: Snippet;
  }

  let {
    variant = 'neutral',
    pulse = false,
    class: className = '',
    children
  }: Props = $props();

  const baseStyles = 'inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md border';

  const variantStyles: Record<Variant, string> = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    info: 'bg-info/10 text-info border-info/20',
    neutral: 'bg-bg-secondary text-text-secondary border-border'
  };

  const dotColors: Record<Variant, string> = {
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
    neutral: 'bg-text-muted'
  };
</script>

<span class={cn(baseStyles, variantStyles[variant], className)}>
  {#if pulse}
    <span class={cn('size-1.5 rounded-full animate-pulse', dotColors[variant])}></span>
  {/if}
  {@render children()}
</span>
