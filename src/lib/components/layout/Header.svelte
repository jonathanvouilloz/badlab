<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import { Button } from '$lib/components/ui';
  import { UserMenu } from '$lib/components/auth';
  import { authClient } from '$lib/auth-client';
  import { Trophy, Plus, Menu, X } from 'lucide-svelte';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();
  let mobileMenuOpen = $state(false);

  const session = authClient.useSession();

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  // Navigation links change based on auth state
  const authenticatedLinks = [
    { href: '/dashboard', label: 'Mes Tournois' },
  ];

  const publicLinks = [
    { href: '/#features', label: 'Fonctionnalites' },
  ];
</script>

<header class={cn('bg-white border-b border-border sticky top-0 z-50', className)}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80">
        <div class="size-10 rounded-lg bg-accent flex items-center justify-center">
          <Trophy class="size-6 text-white" />
        </div>
        <span class="text-xl font-semibold text-text-primary">BadLab</span>
      </a>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-1">
        {#if $session.data?.user}
          {#each authenticatedLinks as link}
            <a
              href={link.href}
              class="px-4 py-2 rounded-lg text-button text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          {/each}
        {:else}
          {#each publicLinks as link}
            <a
              href={link.href}
              class="px-4 py-2 rounded-lg text-button text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          {/each}
        {/if}
      </nav>

      <!-- CTA + User Menu + Mobile Menu Button -->
      <div class="flex items-center gap-3">
        {#if $session.data?.user}
          <a href="/tournament/create" class="hidden sm:block">
            <Button size="sm">
              <Plus class="size-4" />
              <span class="hidden sm:inline">Nouveau tournoi</span>
            </Button>
          </a>
        {/if}

        <UserMenu />

        <!-- Mobile menu button -->
        <button
          type="button"
          onclick={toggleMobileMenu}
          class="md:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors duration-200"
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {#if mobileMenuOpen}
            <X class="size-6 text-text-primary" />
          {:else}
            <Menu class="size-6 text-text-primary" />
          {/if}
        </button>
      </div>
    </div>

    <!-- Mobile Nav -->
    {#if mobileMenuOpen}
      <nav class="md:hidden py-4 border-t border-border">
        <div class="flex flex-col gap-2">
          {#if $session.data?.user}
            {#each authenticatedLinks as link}
              <a
                href={link.href}
                class="px-4 py-3 rounded-lg text-button text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors duration-200"
                onclick={() => (mobileMenuOpen = false)}
              >
                {link.label}
              </a>
            {/each}
            <a href="/tournament/create" class="mt-2" onclick={() => (mobileMenuOpen = false)}>
              <Button class="w-full">
                <Plus class="size-4" />
                Nouveau tournoi
              </Button>
            </a>
          {:else}
            {#each publicLinks as link}
              <a
                href={link.href}
                class="px-4 py-3 rounded-lg text-button text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors duration-200"
                onclick={() => (mobileMenuOpen = false)}
              >
                {link.label}
              </a>
            {/each}
            <div class="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              <a href="/auth/login" onclick={() => (mobileMenuOpen = false)}>
                <Button variant="secondary" class="w-full">Connexion</Button>
              </a>
              <a href="/auth/register" onclick={() => (mobileMenuOpen = false)}>
                <Button class="w-full">S'inscrire</Button>
              </a>
            </div>
          {/if}
        </div>
      </nav>
    {/if}
  </div>
</header>
