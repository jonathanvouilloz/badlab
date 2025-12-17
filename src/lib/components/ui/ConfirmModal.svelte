<script lang="ts">
  import { AlertTriangle, AlertCircle, Info } from 'lucide-svelte';

  type Variant = 'danger' | 'warning' | 'info';

  interface Props {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: Variant;
    loading?: boolean;
    onconfirm: () => void;
    oncancel?: () => void;
  }

  let {
    open = $bindable(false),
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    variant = 'danger',
    loading = false,
    onconfirm,
    oncancel,
  }: Props = $props();

  const variantConfig: Record<Variant, { btnClass: string; iconBgClass: string; iconClass: string; Icon: typeof AlertTriangle }> = {
    danger: {
      btnClass: 'bg-danger hover:bg-danger/90 text-white',
      iconBgClass: 'bg-danger/10',
      iconClass: 'text-danger',
      Icon: AlertTriangle
    },
    warning: {
      btnClass: 'bg-warning hover:bg-warning/90 text-white',
      iconBgClass: 'bg-warning/10',
      iconClass: 'text-warning',
      Icon: AlertCircle
    },
    info: {
      btnClass: 'bg-info hover:bg-info/90 text-white',
      iconBgClass: 'bg-info/10',
      iconClass: 'text-info',
      Icon: Info
    },
  };

  let config = $derived(variantConfig[variant]);

  function handleCancel() {
    open = false;
    oncancel?.();
  }

  function handleConfirm() {
    onconfirm();
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && !loading) {
      handleCancel();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    onclick={handleBackdropClick}
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Modal -->
    <div class="relative bg-white border border-border rounded-xl p-6 shadow-lg max-w-md w-full">
      <!-- Header with icon -->
      <div class="flex items-start gap-4 mb-4">
        <div class="size-10 rounded-lg {config.iconBgClass} flex items-center justify-center shrink-0">
          <config.Icon class="size-5 {config.iconClass}" />
        </div>
        <div>
          <h3 class="heading-3 text-text-primary">{title}</h3>
        </div>
      </div>

      <!-- Message -->
      <p class="text-body text-text-secondary mb-6">{message}</p>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 bg-white hover:bg-bg-secondary text-text-primary text-button px-4 py-2 border border-border rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onclick={handleCancel}
          disabled={loading}
        >
          {cancelText}
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 {config.btnClass} text-button px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onclick={handleConfirm}
          disabled={loading}
        >
          {#if loading}
            <div class="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {/if}
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}
