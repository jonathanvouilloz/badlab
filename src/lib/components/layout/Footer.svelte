<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import { Trophy } from 'lucide-svelte';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();

  const currentYear = new Date().getFullYear();
</script>

<footer class={cn('bg-bg-secondary border-t border-border', className)}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Logo & Tagline -->
      <div class="flex items-center gap-3">
        <div class="size-8 rounded-lg bg-accent flex items-center justify-center">
          <Trophy class="size-4 text-white" />
        </div>
        <div>
          <span class="font-semibold text-text-primary">BadLab</span>
          <p class="text-caption text-text-muted">Le labo des tournois de bad</p>
        </div>
      </div>

      <!-- Links -->
      <nav class="flex items-center gap-6">
        <a
          href="/about"
          class="text-small text-text-secondary hover:text-text-primary transition-colors duration-200"
        >
          A propos
        </a>
        <a
          href="/contact"
          class="text-small text-text-secondary hover:text-text-primary transition-colors duration-200"
        >
          Contact
        </a>
        <a
          href="/legal"
          class="text-small text-text-secondary hover:text-text-primary transition-colors duration-200"
        >
          Mentions legales
        </a>
      </nav>

      <!-- Copyright -->
      <p class="text-caption text-text-muted">
        &copy; {currentYear} BadLab. Tous droits reserves.
      </p>
    </div>
  </div>
</footer>
