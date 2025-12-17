<script lang="ts">
  import { Button } from '$lib/components/ui';
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';
  import { User, LogOut, Settings } from 'lucide-svelte';

  const session = authClient.useSession();

  let menuOpen = $state(false);

  async function handleSignOut() {
    await authClient.signOut();
    menuOpen = false;
    goto('/');
  }

  function getInitials(name: string | undefined | null): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
</script>

{#if $session.isPending}
  <div class="size-10 rounded-full bg-bg-secondary animate-pulse"></div>
{:else if $session.data?.user}
  <div class="relative">
    <button
      onclick={() => (menuOpen = !menuOpen)}
      class="flex items-center gap-2 p-1 rounded-full hover:bg-bg-secondary transition-colors"
    >
      {#if $session.data.user.image}
        <img
          src={$session.data.user.image}
          alt={$session.data.user.name || 'User'}
          class="size-10 rounded-full object-cover"
        />
      {:else}
        <div class="size-10 rounded-full bg-accent/10 flex items-center justify-center">
          <span class="text-sm font-semibold text-accent">
            {getInitials($session.data.user.name)}
          </span>
        </div>
      {/if}
    </button>

    {#if menuOpen}
      <!-- Backdrop -->
      <button
        class="fixed inset-0 z-40"
        onclick={() => (menuOpen = false)}
        aria-label="Fermer le menu"
      ></button>

      <!-- Menu -->
      <div class="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg py-2 z-50">
        <div class="px-4 py-2 border-b border-border">
          <p class="font-medium text-text-primary truncate">
            {$session.data.user.name || 'Utilisateur'}
          </p>
          <p class="text-sm text-text-muted truncate">
            {$session.data.user.email}
          </p>
        </div>

        <a
          href="/profile"
          class="flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-bg-secondary transition-colors"
          onclick={() => (menuOpen = false)}
        >
          <Settings class="size-4" />
          Profil
        </a>

        <button
          onclick={handleSignOut}
          class="flex items-center gap-2 px-4 py-2 w-full text-left text-danger hover:bg-bg-secondary transition-colors"
        >
          <LogOut class="size-4" />
          Se deconnecter
        </button>
      </div>
    {/if}
  </div>
{:else}
  <div class="flex items-center gap-2">
    <a href="/auth/login">
      <Button variant="ghost" size="sm">Connexion</Button>
    </a>
    <a href="/auth/register">
      <Button size="sm">S'inscrire</Button>
    </a>
  </div>
{/if}
