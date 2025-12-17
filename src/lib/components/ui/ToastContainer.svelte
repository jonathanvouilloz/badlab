<script lang="ts">
  import { toasts } from '$lib/stores/toast';
  import Toast from './Toast.svelte';
</script>

<div class="toast toast-end toast-top z-50">
  {#each $toasts as toast (toast.id)}
    <Toast
      message={toast.message}
      variant={toast.variant}
      onclose={() => toasts.dismiss(toast.id)}
    />
  {/each}
</div>
