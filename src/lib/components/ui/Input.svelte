<script lang="ts">
  import { cn } from '$lib/utils/cn';

  interface Props {
    id?: string;
    name?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time';
    value?: string | number;
    placeholder?: string;
    label?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
  }

  let {
    id,
    name,
    type = 'text',
    value = $bindable(''),
    placeholder = '',
    label,
    hint,
    error,
    disabled = false,
    required = false,
    class: className = '',
    oninput,
    onchange
  }: Props = $props();

  const inputStyles = cn(
    'w-full bg-white text-text-primary placeholder:text-text-muted',
    'border rounded-lg px-4 py-2.5 text-base',
    'focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
    'disabled:bg-bg-secondary disabled:cursor-not-allowed',
    'transition-colors duration-200',
    error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-border',
    className
  );
</script>

<div class="space-y-1.5">
  {#if label}
    <label for={id} class="block text-sm font-medium text-text-primary">
      {label}
      {#if required}
        <span class="text-danger">*</span>
      {/if}
    </label>
  {/if}

  <input
    {id}
    {name}
    {type}
    bind:value
    {placeholder}
    {disabled}
    {required}
    class={inputStyles}
    oninput={oninput}
    onchange={onchange}
  />

  {#if error}
    <p class="text-xs text-danger">{error}</p>
  {:else if hint}
    <p class="text-xs text-text-muted">{hint}</p>
  {/if}
</div>
