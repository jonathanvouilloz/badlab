<script lang="ts">
  import { X, Check, AlertCircle, AlertTriangle, Info } from 'lucide-svelte';
  import type { ToastVariant } from '$lib/stores/toast';

  interface Props {
    message: string;
    variant?: ToastVariant;
    onclose?: () => void;
  }

  let { message, variant = 'info', onclose }: Props = $props();

  const variantClasses: Record<ToastVariant, string> = {
    success: 'bg-success/10 text-success border border-success/20',
    error: 'bg-danger/10 text-danger border border-danger/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    info: 'bg-info/10 text-info border border-info/20',
  };

  const icons: Record<ToastVariant, typeof Check> = {
    success: Check,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  let Icon = $derived(icons[variant]);
</script>

<div
  class="flex items-center gap-3 bg-white {variantClasses[variant]} rounded-lg px-4 py-3 shadow-lg animate-in slide-in-from-right duration-300 min-w-[300px]"
  role="alert"
>
  <Icon class="size-5 shrink-0" />
  <span class="flex-1 text-small font-medium">{message}</span>
  {#if onclose}
    <button
      type="button"
      class="p-1 rounded hover:bg-black/5 transition-colors duration-200"
      onclick={onclose}
      aria-label="Fermer"
    >
      <X class="size-4" />
    </button>
  {/if}
</div>

<style>
  @keyframes slide-in-from-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-in {
    animation: slide-in-from-right 0.3s ease-out;
  }
</style>
