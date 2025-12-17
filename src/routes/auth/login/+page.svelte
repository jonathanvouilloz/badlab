<script lang="ts">
  import { AuthCard, LoginForm } from '$lib/components/auth';
  import { page } from '$app/stores';
  import { ArrowLeft } from 'lucide-svelte';

  const redirectTo = $derived($page.url.searchParams.get('redirectTo') || '/dashboard');
</script>

<AuthCard
  title="Connexion"
  subtitle="Connectez-vous a votre compte BadLab"
>
  <LoginForm {redirectTo} />

  {#snippet footer()}
    <p class="text-body text-text-secondary">
      Pas encore de compte ?
      <a href="/auth/register?redirectTo={encodeURIComponent(redirectTo)}" class="text-accent hover:underline font-medium">
        S'inscrire
      </a>
    </p>
    <a
      href="/auth"
      class="inline-flex items-center gap-2 text-small text-text-muted hover:text-text-secondary transition-colors duration-200 mt-4"
    >
      <ArrowLeft class="size-4" />
      Autres options de connexion
    </a>
  {/snippet}
</AuthCard>
