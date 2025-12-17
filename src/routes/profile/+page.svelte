<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { getFunctionName } from 'convex/server';
  import { Card, Button, Input, ConfirmModal, Badge } from '$lib/components/ui';
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';

  const session = authClient.useSession();
  const convexClient = useConvexClient();
  const appUserQuery = useQuery(api.users.getCurrentAppUser, {});

  // États dérivés
  let isAuthenticated = $derived(!!$session.data);
  let authLoading = $derived($session.isPending);
  let appUser = $derived(appUserQuery.data);
  let loading = $derived(authLoading || appUserQuery.isLoading);

  // États pour le formulaire de profil
  let name = $state('');
  let profileLoading = $state(false);
  let profileSuccess = $state('');
  let profileError = $state('');

  // États pour le changement de mot de passe
  let currentPassword = $state('');
  let newPassword = $state('');
  let confirmNewPassword = $state('');
  let passwordLoading = $state(false);
  let passwordSuccess = $state('');
  let passwordError = $state('');

  // États pour la suppression de compte
  let deleteModalOpen = $state(false);

  // Initialiser le nom quand l'utilisateur est chargé
  $effect(() => {
    if (appUser?.name) {
      name = appUser.name;
    }
  });

  // Rediriger si non authentifié
  $effect(() => {
    if (!authLoading && !isAuthenticated) {
      goto('/auth/login');
    }
  });

  async function handleUpdateProfile() {
    if (!appUser) return;

    profileLoading = true;
    profileSuccess = '';
    profileError = '';

    try {
      await convexClient.mutation(getFunctionName(api.users.update), {
        id: appUser._id,
        name: name || undefined
      });
      profileSuccess = 'Profil mis a jour avec succes';
    } catch (err) {
      profileError = 'Erreur lors de la mise a jour du profil';
    } finally {
      profileLoading = false;
    }
  }

  async function handleChangePassword() {
    passwordLoading = true;
    passwordSuccess = '';
    passwordError = '';

    if (newPassword !== confirmNewPassword) {
      passwordError = 'Les mots de passe ne correspondent pas';
      passwordLoading = false;
      return;
    }

    if (newPassword.length < 8) {
      passwordError = 'Le nouveau mot de passe doit contenir au moins 8 caracteres';
      passwordLoading = false;
      return;
    }

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true
      });

      if (result.error) {
        passwordError = result.error.message || 'Erreur lors du changement de mot de passe';
      } else {
        passwordSuccess = 'Mot de passe change avec succes';
        currentPassword = '';
        newPassword = '';
        confirmNewPassword = '';
      }
    } catch (err) {
      passwordError = 'Erreur lors du changement de mot de passe';
    } finally {
      passwordLoading = false;
    }
  }

  async function handleDeleteAccount() {
    if (!appUser) return;

    try {
      // Supprimer le compte better-auth (demande le mot de passe via better-auth)
      const result = await authClient.deleteUser();

      if (result.error) {
        // L'erreur sera gérée par better-auth
        return;
      }

      // Supprimer l'utilisateur app dans Convex
      await convexClient.mutation(getFunctionName(api.users.remove), {
        id: appUser._id
      });

      // Rediriger vers l'accueil
      goto('/');
    } catch (err) {
      // L'erreur sera gérée par better-auth
    }
  }
</script>

<svelte:head>
  <title>Mon Profil - BadLab</title>
</svelte:head>

<div class="max-w-2xl mx-auto p-6 space-y-6">
  <h1 class="heading-1 text-text-primary">Mon Profil</h1>

  {#if loading}
    <Card>
      <p class="text-body text-text-secondary text-center">Chargement...</p>
    </Card>
  {:else if !isAuthenticated}
    <Card>
      <p class="text-body text-text-secondary text-center">Redirection vers la connexion...</p>
    </Card>
  {:else if appUser}
    <!-- Section Informations -->
    <Card>
      {#snippet header()}
        <h2 class="heading-2 text-text-primary">Informations personnelles</h2>
      {/snippet}

      <form onsubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }} class="space-y-4">
        <Input
          type="email"
          label="Email"
          value={appUser.email}
          disabled
          hint="L'email ne peut pas etre modifie"
        />

        <Input
          type="text"
          label="Nom"
          placeholder="Votre nom"
          bind:value={name}
        />

        <div>
          <label class="text-label text-text-primary mb-1.5 block">Role</label>
          <Badge variant={appUser.role === 'organizer' ? 'info' : 'neutral'}>
            {appUser.role === 'organizer' ? 'Organisateur' : 'Joueur'}
          </Badge>
        </div>

        {#if profileSuccess}
          <p class="text-small text-success">{profileSuccess}</p>
        {/if}
        {#if profileError}
          <p class="text-small text-danger">{profileError}</p>
        {/if}

        <Button type="submit" disabled={profileLoading}>
          {profileLoading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </form>
    </Card>

    <!-- Section Mot de passe -->
    <Card>
      {#snippet header()}
        <h2 class="heading-2 text-text-primary">Changer le mot de passe</h2>
      {/snippet}

      <form onsubmit={(e) => { e.preventDefault(); handleChangePassword(); }} class="space-y-4">
        <Input
          type="password"
          label="Mot de passe actuel"
          placeholder="Votre mot de passe actuel"
          bind:value={currentPassword}
          required
        />

        <Input
          type="password"
          label="Nouveau mot de passe"
          placeholder="Minimum 8 caracteres"
          bind:value={newPassword}
          required
          hint="Minimum 8 caracteres"
        />

        <Input
          type="password"
          label="Confirmer le nouveau mot de passe"
          placeholder="Retapez le nouveau mot de passe"
          bind:value={confirmNewPassword}
          required
          error={confirmNewPassword && newPassword !== confirmNewPassword ? 'Les mots de passe ne correspondent pas' : undefined}
        />

        {#if passwordSuccess}
          <p class="text-small text-success">{passwordSuccess}</p>
        {/if}
        {#if passwordError}
          <p class="text-small text-danger">{passwordError}</p>
        {/if}

        <Button type="submit" disabled={passwordLoading}>
          {passwordLoading ? 'Modification...' : 'Changer le mot de passe'}
        </Button>
      </form>
    </Card>

    <!-- Section Zone Danger -->
    <Card class="border-danger">
      {#snippet header()}
        <h2 class="heading-2 text-danger">Zone de danger</h2>
      {/snippet}

      <p class="text-body text-text-secondary mb-4">
        La suppression de votre compte est irreversible. Toutes vos donnees seront definitivement supprimees.
      </p>

      <Button variant="danger" onclick={() => deleteModalOpen = true}>
        Supprimer mon compte
      </Button>
    </Card>

    <!-- Modal de confirmation de suppression -->
    <ConfirmModal
      bind:open={deleteModalOpen}
      title="Supprimer mon compte"
      message="Cette action est irreversible. Toutes vos donnees seront definitivement supprimees. Voulez-vous vraiment continuer ?"
      variant="danger"
      confirmText="Supprimer definitivement"
      cancelText="Annuler"
      onconfirm={handleDeleteAccount}
    />
  {:else}
    <Card>
      <p class="text-body text-text-secondary text-center">Aucun profil trouve. Veuillez vous reconnecter.</p>
    </Card>
  {/if}
</div>
