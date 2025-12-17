<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { Snippet } from 'svelte';

  type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
  type Size = 'sm' | 'default' | 'lg';

  interface Props {
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    onclick?: (event: MouseEvent) => void;
    children: Snippet;
  }

  let {
    variant = 'primary',
    size = 'default',
    disabled = false,
    type = 'button',
    class: className = '',
    onclick,
    children
  }: Props = $props();

  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles: Record<Variant, string> = {
    primary: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent',
    secondary: 'bg-white text-text-primary border border-border hover:bg-bg-secondary focus:ring-accent',
    ghost: 'bg-transparent text-text-primary hover:bg-bg-secondary',
    danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-danger'
  };

  const sizeStyles: Record<Size, string> = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
</script>

<button
  {type}
  {disabled}
  class={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
  onclick={onclick}
>
  {@render children()}
</button>
