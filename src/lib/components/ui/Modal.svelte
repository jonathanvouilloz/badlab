<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import { X } from 'lucide-svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    title?: string;
    size?: 'sm' | 'default' | 'lg' | 'xl';
    class?: string;
    onclose?: () => void;
    children: Snippet;
    footer?: Snippet;
  }

  let {
    open = $bindable(false),
    title,
    size = 'default',
    class: className = '',
    onclose,
    children,
    footer
  }: Props = $props();

  const sizeStyles = {
    sm: 'max-w-sm',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  function handleClose() {
    open = false;
    onclose?.();
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? 'modal-title' : undefined}
  >
    <!-- Modal -->
    <div class={cn('bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto', sizeStyles[size], className)}>
      <!-- Header -->
      {#if title}
        <div class="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 id="modal-title" class="text-xl font-bold text-text-primary">
            {title}
          </h2>
          <button
            type="button"
            onclick={handleClose}
            class="p-1 rounded-lg hover:bg-bg-secondary transition-colors duration-200"
            aria-label="Fermer"
          >
            <X class="size-5 text-text-secondary" />
          </button>
        </div>
      {:else}
        <button
          type="button"
          onclick={handleClose}
          class="absolute top-4 right-4 p-1 rounded-lg hover:bg-bg-secondary transition-colors duration-200"
          aria-label="Fermer"
        >
          <X class="size-5 text-text-secondary" />
        </button>
      {/if}

      <!-- Content -->
      <div class="px-6 py-6">
        {@render children()}
      </div>

      <!-- Footer -->
      {#if footer}
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-bg-secondary rounded-b-xl">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
