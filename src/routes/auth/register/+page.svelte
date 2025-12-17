<script lang="ts">
  import { AuthCard, RegisterForm } from '$lib/components/auth';
  import { page } from '$app/stores';
  import { ArrowLeft } from 'lucide-svelte';

  const redirectTo = $derived($page.url.searchParams.get('redirectTo') || '/dashboard');
</script>

<AuthCard
  title="Creer un compte"
  subtitle="Rejoignez BadLab gratuitement"
>
  <RegisterForm {redirectTo} />

  {#snippet footer()}
    <p class="text-body text-text-secondary">
      Deja un compte ?
      <a href="/auth/login?redirectTo={encodeURIComponent(redirectTo)}" class="text-accent hover:underline font-medium">
        Se connecter
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
