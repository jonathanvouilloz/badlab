<script lang="ts">
  import { Input, Button } from '$lib/components/ui';
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';

  interface Props {
    redirectTo?: string;
  }

  let { redirectTo = '/dashboard' }: Props = $props();

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    loading = true;

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        error = result.error.message || 'Email ou mot de passe incorrect';
      } else {
        goto(redirectTo);
      }
    } catch (err) {
      error = 'Une erreur est survenue. Veuillez reessayer.';
    } finally {
      loading = false;
    }
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  <Input
    type="email"
    label="Email"
    placeholder="vous@exemple.com"
    bind:value={email}
    required
  />

  <Input
    type="password"
    label="Mot de passe"
    placeholder="Votre mot de passe"
    bind:value={password}
    required
  />

  {#if error}
    <p class="text-small text-danger">{error}</p>
  {/if}

  <Button type="submit" class="w-full" disabled={loading}>
    {loading ? 'Connexion...' : 'Se connecter'}
  </Button>

  <p class="text-center text-small text-text-secondary">
    <a href="/auth/forgot-password" class="text-accent hover:underline">
      Mot de passe oublie ?
    </a>
  </p>
</form>
