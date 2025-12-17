<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { getFunctionName } from 'convex/server';
  import { Button, Card } from '$lib/components/ui';
  import { getPermissions } from '$lib/auth-utils';
  import { authClient } from '$lib/auth-client';

  // Session better-auth
  const session = authClient.useSession();
  const convexClient = useConvexClient();

  // Queries Convex pour l'utilisateur app et son rôle
  const appUserQuery = useQuery(api.users.getCurrentAppUser, {});
  const roleQuery = useQuery(api.users.getRole, {});

  // États dérivés
  let isAuthenticated = $derived(!!$session.data);
  let authLoading = $derived($session.isPending);
  let appUser = $derived(appUserQuery.data);
  let role = $derived(roleQuery.data);
  let permissions = $derived(getPermissions(role ?? null));
  let loading = $derived(authLoading || appUserQuery.isLoading);

  // Créer l'utilisateur app si connecté mais pas encore créé
  async function ensureAppUser() {
    if (isAuthenticated && !appUser) {
      await convexClient.mutation(getFunctionName(api.users.getOrCreateAppUser), {});
    }
  }

  // Effet pour créer l'utilisateur app automatiquement
  $effect(() => {
    if (isAuthenticated && !appUser && !loading) {
      ensureAppUser();
    }
  });
</script>

<svelte:head>
  <title>Test des Rôles - BadLab</title>
</svelte:head>

<div class="max-w-4xl mx-auto p-6 space-y-6">
  <h1 class="heading-1 text-text-primary">Test des Rôles</h1>
  <p class="text-body text-text-secondary">Cette page permet de visualiser les permissions selon ton rôle.</p>

  {#if loading}
    <Card class="p-6">
      <p class="text-center text-body text-text-secondary">Chargement...</p>
    </Card>
  {:else if !isAuthenticated}
    <Card class="p-6 border-danger">
      <p class="text-body text-danger">Non connecté. Connecte-toi pour voir tes permissions.</p>
      <a href="/auth/login" class="inline-block mt-4 px-6 py-3 bg-accent text-white text-button rounded-lg hover:bg-accent-hover transition-colors duration-200">
        Se connecter
      </a>
    </Card>
  {:else if !appUser}
    <Card class="p-6">
      <p class="text-body text-text-secondary">Création de ton profil utilisateur...</p>
      <Button onclick={ensureAppUser} class="mt-4">
        Créer mon profil
      </Button>
    </Card>
  {:else}
    <!-- Infos utilisateur -->
    <Card class="p-6">
      <h2 class="heading-2 text-text-primary mb-4">Utilisateur connecté</h2>
      <div class="space-y-2">
        <p class="text-body text-text-primary"><span class="text-label">Nom:</span> {appUser.name || 'Non renseigné'}</p>
        <p class="text-body text-text-primary"><span class="text-label">Email:</span> {appUser.email}</p>
        <p class="text-body text-text-primary">
          <span class="text-label">Rôle:</span>
          <span class="inline-flex items-center gap-1.5 {role === 'organizer' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-bg-tertiary text-text-secondary border border-border'} text-xs font-semibold px-2 py-1 rounded-md">
            {role || 'Non défini'}
          </span>
        </p>
        <p class="text-small text-text-muted">
          ID App: {appUser._id}
        </p>
      </div>
    </Card>

    <!-- Permissions -->
    <Card class="p-6">
      <h2 class="heading-2 text-text-primary mb-4">Tes permissions</h2>

      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr class="border-b-2 border-border">
              <th class="text-caption text-text-secondary">PERMISSION</th>
              <th class="text-center text-caption text-text-secondary">STATUT</th>
              <th class="text-caption text-text-secondary">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover">
              <td class="font-semibold text-text-primary">Créer un tournoi</td>
              <td class="text-center">
                {#if permissions.canCreateTournament}
                  <span class="text-success text-xl">✓</span>
                {:else}
                  <span class="text-danger text-xl">✗</span>
                {/if}
              </td>
              <td class="text-small text-text-secondary">
                Permet de créer de nouveaux tournois
              </td>
            </tr>
            <tr class="hover">
              <td class="font-semibold text-text-primary">Gérer un tournoi</td>
              <td class="text-center">
                {#if permissions.canManageTournament}
                  <span class="text-success text-xl">✓</span>
                {:else}
                  <span class="text-danger text-xl">✗</span>
                {/if}
              </td>
              <td class="text-small text-text-secondary">
                Modifier les paramètres, ajouter des participants
              </td>
            </tr>
            <tr class="hover">
              <td class="font-semibold text-text-primary">Saisir des scores</td>
              <td class="text-center">
                {#if permissions.canEnterScore}
                  <span class="text-success text-xl">✓</span>
                {:else}
                  <span class="text-danger text-xl">✗</span>
                {/if}
              </td>
              <td class="text-small text-text-secondary">
                Entrer les résultats des matchs
              </td>
            </tr>
            <tr class="hover">
              <td class="font-semibold text-text-primary">S'inscrire aux tournois</td>
              <td class="text-center">
                {#if permissions.canRegister}
                  <span class="text-success text-xl">✓</span>
                {:else}
                  <span class="text-danger text-xl">✗</span>
                {/if}
              </td>
              <td class="text-small text-text-secondary">
                Participer aux tournois ouverts
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Comparaison des rôles -->
    <Card class="p-6">
      <h2 class="heading-2 text-text-primary mb-4">Comparaison des rôles</h2>

      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr class="border-b-2 border-border">
              <th class="text-caption text-text-secondary">PERMISSION</th>
              <th class="text-center text-caption text-text-secondary bg-accent/10">ORGANIZER</th>
              <th class="text-center text-caption text-text-secondary">PLAYER</th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover">
              <td class="font-semibold text-text-primary">Créer tournoi</td>
              <td class="text-center bg-accent/5"><span class="text-success">✓</span></td>
              <td class="text-center"><span class="text-danger">✗</span></td>
            </tr>
            <tr class="hover">
              <td class="font-semibold text-text-primary">Gérer tournoi</td>
              <td class="text-center bg-accent/5"><span class="text-success">✓</span></td>
              <td class="text-center"><span class="text-danger">✗</span></td>
            </tr>
            <tr class="hover">
              <td class="font-semibold text-text-primary">Saisir scores</td>
              <td class="text-center bg-accent/5"><span class="text-success">✓</span></td>
              <td class="text-center"><span class="text-success">✓</span></td>
            </tr>
            <tr class="hover">
              <td class="font-semibold text-text-primary">S'inscrire</td>
              <td class="text-center bg-accent/5"><span class="text-success">✓</span></td>
              <td class="text-center"><span class="text-success">✓</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Instructions -->
    <Card class="p-6">
      <h2 class="heading-2 text-text-primary mb-4">Changer de rôle</h2>
      <p class="text-body text-text-secondary">
        Pour changer ton rôle, va dans le <strong class="text-text-primary">Dashboard Convex</strong> :
      </p>
      <ol class="list-decimal list-inside mt-4 space-y-2 text-body text-text-secondary">
        <li>Ouvre le <a href="https://dashboard.convex.dev" target="_blank" class="text-accent hover:text-accent-hover transition-colors duration-200 underline">Dashboard Convex</a></li>
        <li>Va dans <strong class="text-text-primary">Data</strong> → table <strong class="text-text-primary">users</strong></li>
        <li>Trouve ton utilisateur (email: {appUser.email})</li>
        <li>Modifie le champ <code class="bg-bg-tertiary text-text-primary px-1 rounded">role</code> en <code class="bg-bg-tertiary text-text-primary px-1 rounded">"organizer"</code> ou <code class="bg-bg-tertiary text-text-primary px-1 rounded">"player"</code></li>
        <li>Rafraîchis cette page</li>
      </ol>
    </Card>
  {/if}
</div>
