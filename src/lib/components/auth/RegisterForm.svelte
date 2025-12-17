<script lang="ts">
  import { Input, Button } from '$lib/components/ui';
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';

  interface Props {
    redirectTo?: string;
  }

  let { redirectTo = '/dashboard' }: Props = $props();

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';

    if (password !== confirmPassword) {
      error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (password.length < 8) {
      error = 'Le mot de passe doit contenir au moins 8 caracteres';
      return;
    }

    loading = true;

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        error = result.error.message || 'Erreur lors de la creation du compte';
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
    type="text"
    label="Nom"
    placeholder="Votre nom"
    bind:value={name}
  />

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
    placeholder="Minimum 8 caracteres"
    bind:value={password}
    required
    hint="Minimum 8 caracteres"
  />

  <Input
    type="password"
    label="Confirmer le mot de passe"
    placeholder="Retapez votre mot de passe"
    bind:value={confirmPassword}
    required
    error={confirmPassword && password !== confirmPassword ? 'Les mots de passe ne correspondent pas' : undefined}
  />

  {#if error}
    <p class="text-small text-danger">{error}</p>
  {/if}

  <Button type="submit" class="w-full" disabled={loading}>
    {loading ? 'Creation...' : 'Creer un compte'}
  </Button>
</form>
