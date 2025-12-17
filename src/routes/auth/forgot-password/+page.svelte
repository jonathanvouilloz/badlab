<script lang="ts">
  import { AuthCard } from '$lib/components/auth';
  import { Input, Button } from '$lib/components/ui';
  import { authClient } from '$lib/auth-client';
  import { Mail } from 'lucide-svelte';

  let email = $state('');
  let sent = $state(false);
  let loading = $state(false);
  let error = $state('');

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      const result = await authClient.forgetPassword({
        email,
        redirectTo: '/auth/reset-password',
      });

      if (result.error) {
        error = result.error.message || 'Erreur lors de l\'envoi';
      } else {
        sent = true;
      }
    } catch (err) {
      // Even if error, show success message for security
      sent = true;
    } finally {
      loading = false;
    }
  }
</script>

<AuthCard
  title="Mot de passe oublie ?"
  subtitle="Entrez votre email pour recevoir un lien de reinitialisation"
>
  {#if sent}
    <div class="text-center py-4">
      <div class="size-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
        <Mail class="size-8 text-success" />
      </div>
      <h3 class="heading-3 text-text-primary mb-2">Email envoye !</h3>
      <p class="text-body text-text-secondary">
        Si un compte existe avec l'adresse <strong>{email}</strong>,
        vous recevrez un email avec les instructions de reinitialisation.
      </p>
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="space-y-4">
      <Input
        type="email"
        label="Email"
        placeholder="vous@exemple.com"
        bind:value={email}
        required
      />

      {#if error}
        <p class="text-small text-danger">{error}</p>
      {/if}

      <Button type="submit" class="w-full" disabled={loading}>
        {loading ? 'Envoi...' : 'Reinitialiser le mot de passe'}
      </Button>
    </form>
  {/if}

  {#snippet footer()}
    <a href="/auth/login" class="text-accent hover:underline font-medium">
      Retour a la connexion
    </a>
  {/snippet}
</AuthCard>
