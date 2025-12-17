import { writable, derived } from 'svelte/store';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

const DEFAULT_DURATION = 3000;

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function addToast(message: string, variant: ToastVariant = 'info', duration: number = DEFAULT_DURATION): string {
    const id = crypto.randomUUID();

    update((toasts) => [...toasts, { id, message, variant, duration }]);

    // Auto-dismiss après duration
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }

  function dismissToast(id: string) {
    update((toasts) => toasts.filter((t) => t.id !== id));
  }

  function clearAll() {
    update(() => []);
  }

  return {
    subscribe,
    add: addToast,
    dismiss: dismissToast,
    clear: clearAll,
    // Raccourcis pratiques
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
  };
}

export const toasts = createToastStore();
