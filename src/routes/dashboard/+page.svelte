<script lang="ts">
  import { useQuery } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { Card, Button, Badge } from '$lib/components/ui';
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';
  import {
    Trophy,
    Plus,
    Users,
    Calendar,
    ArrowRight,
    User,
    Search,
    BarChart3,
    Clock
  } from 'lucide-svelte';

  // Auth state
  const session = authClient.useSession();

  // User queries
  const appUserQuery = useQuery(api.users.getCurrentAppUser, {});

  // Derived states
  let isAuthenticated = $derived(!!$session.data);
  let authLoading = $derived($session.isPending);
  let appUser = $derived(appUserQuery.data);
  let isOrganizer = $derived(appUser?.role === 'organizer');
  let loading = $derived(authLoading || appUserQuery.isLoading);

  // Queries for organizers
  const myTournamentsQuery = useQuery(api.tournaments.getMyTournaments, {});
  const organizerStatsQuery = useQuery(api.tournaments.getOrganizerStats, {});

  // Queries for players
  const myRegistrationsQuery = useQuery(api.participants.getMyRegistrations, {});
  const playerStatsQuery = useQuery(api.participants.getPlayerStats, {});

  // Derived data
  let myTournaments = $derived(myTournamentsQuery.data ?? []);
  let organizerStats = $derived(organizerStatsQuery.data);
  let myRegistrations = $derived(myRegistrationsQuery.data ?? []);
  let playerStats = $derived(playerStatsQuery.data);

  // Redirect if not authenticated
  $effect(() => {
    if (!authLoading && !isAuthenticated) {
      goto('/auth/login?redirectTo=/dashboard');
    }
  });

  // Format date helper
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // Get status badge variant
  function getStatusVariant(status: string): 'success' | 'info' | 'danger' | 'neutral' {
    switch (status) {
      case 'registration_open':
        return 'success';
      case 'in_progress':
        return 'info'; // Changed from 'warning' to 'info' per styleguide
      case 'finished':
        return 'success'; // Changed from 'neutral' to 'success' for completed tournaments
      case 'draft':
        return 'neutral';
      default:
        return 'neutral';
    }
  }

  // Get status label in French
  function getStatusLabel(status: string): string {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'registration_open':
        return 'Inscriptions ouvertes';
      case 'in_progress':
        return 'En cours';
      case 'finished':
        return 'Termine';
      default:
        return status;
    }
  }
</script>

<svelte:head>
  <title>Tableau de bord - BadLab</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
  {#if loading}
    <Card hover={false} class="p-12">
      <div class="flex flex-col items-center justify-center gap-4">
        <div class="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p class="text-body text-text-secondary">Chargement...</p>
      </div>
    </Card>
  {:else if !isAuthenticated}
    <Card hover={false} class="p-12">
      <div class="text-center">
        <p class="text-body text-text-secondary mb-4">Redirection vers la connexion...</p>
      </div>
    </Card>
  {:else if appUser}
    <!-- Welcome Section with Quick Actions -->
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="heading-1 text-text-primary">
            Bonjour, {appUser.name || 'Utilisateur'}
          </h1>
          <Badge variant={isOrganizer ? 'info' : 'neutral'}>
            {isOrganizer ? 'Organisateur' : 'Joueur'}
          </Badge>
        </div>
        <p class="text-body text-text-secondary">
          {#if isOrganizer}
            Gerez vos tournois et suivez vos participants
          {:else}
            Retrouvez vos inscriptions et participations
          {/if}
        </p>
      </div>

      <!-- Quick Actions as buttons -->
      <div class="flex items-center gap-2">
        {#if isOrganizer}
          <a href="/tournament/create">
            <Button variant="primary" size="sm">
              <Plus class="size-4" />
              Creer un tournoi
            </Button>
          </a>
          <a href="/tournaments">
            <Button variant="secondary" size="sm">
              <Trophy class="size-4" />
              Mes tournois
            </Button>
          </a>
          <a href="/profile">
            <Button variant="ghost" size="sm">
              <User class="size-4" />
              Profil
            </Button>
          </a>
        {:else}
          <a href="/tournaments">
            <Button variant="primary" size="sm">
              <Search class="size-4" />
              Parcourir
            </Button>
          </a>
          <a href="/profile">
            <Button variant="secondary" size="sm">
              <User class="size-4" />
              Mon profil
            </Button>
          </a>
        {/if}
      </div>
    </div>

    <!-- Stats Section -->
    {#if isOrganizer && organizerStats}
      <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div class="stat">
          <div class="stat-figure text-accent">
            <Trophy class="size-8" />
          </div>
          <div class="stat-title text-text-secondary">Tournois créés</div>
          <div class="stat-value text-accent">{organizerStats.totalTournaments}</div>
        </div>
        <div class="stat">
          <div class="stat-figure text-info">
            <Clock class="size-8" />
          </div>
          <div class="stat-title text-text-secondary">Tournois actifs</div>
          <div class="stat-value text-info">{organizerStats.activeTournaments}</div>
        </div>
        <div class="stat">
          <div class="stat-figure text-success">
            <Users class="size-8" />
          </div>
          <div class="stat-title text-text-secondary">Participants total</div>
          <div class="stat-value text-success">{organizerStats.totalParticipants}</div>
        </div>
      </div>
    {:else if !isOrganizer && playerStats}
      <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div class="stat">
          <div class="stat-figure text-accent">
            <Trophy class="size-8" />
          </div>
          <div class="stat-title text-text-secondary">Tournois participés</div>
          <div class="stat-value text-accent">{playerStats.tournamentsParticipated}</div>
        </div>
        <div class="stat">
          <div class="stat-figure text-info">
            <BarChart3 class="size-8" />
          </div>
          <div class="stat-title text-text-secondary">Matchs joués</div>
          <div class="stat-value text-info">{playerStats.matchesPlayed}</div>
        </div>
        <div class="stat">
          <div class="stat-figure text-success">
            <Calendar class="size-8" />
          </div>
          <div class="stat-title text-text-secondary">Taux de victoire</div>
          <div class="stat-value text-success">{playerStats.winRate !== null ? `${playerStats.winRate}%` : '-'}</div>
        </div>
      </div>
    {/if}

    <!-- Tournaments/Registrations List -->
    {#if isOrganizer}
      <Card hover={false} padding="none">
        {#snippet header()}
          <div class="flex items-center justify-between">
            <h2 class="heading-2 text-text-primary">Mes tournois</h2>
            <a href="/tournaments" class="text-small text-accent hover:underline flex items-center gap-1">
              Voir tout <ArrowRight class="size-4" />
            </a>
          </div>
        {/snippet}

        {#if myTournaments.length === 0}
          <div class="p-8 text-center">
            <div class="size-16 rounded-2xl bg-bg-secondary flex items-center justify-center mx-auto mb-4">
              <Trophy class="size-8 text-text-muted" />
            </div>
            <h3 class="heading-3 text-text-primary mb-2">Aucun tournoi</h3>
            <p class="text-body text-text-secondary mb-4">Vous n'avez pas encore cree de tournoi</p>
            <a href="/tournament/create">
              <Button>
                <Plus class="size-5" />
                Creer mon premier tournoi
              </Button>
            </a>
          </div>
        {:else}
          <div class="overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr class="border-b-2 border-border">
                  <th class="text-caption text-text-secondary">Tournoi</th>
                  <th class="text-caption text-text-secondary">Statut</th>
                  <th class="text-caption text-text-secondary">Date</th>
                  <th class="text-caption text-text-secondary">Lieu</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {#each myTournaments.slice(0, 5) as tournament}
                  <tr class="hover">
                    <td class="font-semibold text-text-primary">{tournament.name}</td>
                    <td>
                      <Badge variant={getStatusVariant(tournament.status)} pulse={tournament.status === 'in_progress'}>
                        {getStatusLabel(tournament.status)}
                      </Badge>
                    </td>
                    <td>
                      <span class="flex items-center gap-1 text-small text-text-secondary">
                        <Calendar class="size-4" />
                        {formatDate(tournament.startDate)}
                      </span>
                    </td>
                    <td class="text-small text-text-secondary">{tournament.location ?? '-'}</td>
                    <td>
                      <a href="/tournament/{tournament._id}" class="btn btn-ghost btn-sm">
                        <ArrowRight class="size-4" />
                      </a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </Card>
    {:else}
      <Card hover={false} padding="none">
        {#snippet header()}
          <div class="flex items-center justify-between">
            <h2 class="heading-2 text-text-primary">Mes inscriptions</h2>
            <a href="/tournaments" class="text-small text-accent hover:underline flex items-center gap-1">
              Parcourir <ArrowRight class="size-4" />
            </a>
          </div>
        {/snippet}

        {#if myRegistrations.length === 0}
          <div class="p-8 text-center">
            <div class="size-16 rounded-2xl bg-bg-secondary flex items-center justify-center mx-auto mb-4">
              <Users class="size-8 text-text-muted" />
            </div>
            <h3 class="heading-3 text-text-primary mb-2">Aucune inscription</h3>
            <p class="text-body text-text-secondary mb-4">Vous n'etes inscrit a aucun tournoi</p>
            <a href="/tournaments">
              <Button>
                <Search class="size-5" />
                Trouver un tournoi
              </Button>
            </a>
          </div>
        {:else}
          <div class="overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr class="border-b-2 border-border">
                  <th class="text-caption text-text-secondary">Tournoi</th>
                  <th class="text-caption text-text-secondary">Statut</th>
                  <th class="text-caption text-text-secondary">Date</th>
                  <th class="text-caption text-text-secondary">Lieu</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {#each myRegistrations as registration}
                  <tr class="hover">
                    <td class="font-semibold text-text-primary">{registration.tournament.name}</td>
                    <td>
                      <Badge variant={getStatusVariant(registration.tournament.status)} pulse={registration.tournament.status === 'in_progress'}>
                        {getStatusLabel(registration.tournament.status)}
                      </Badge>
                    </td>
                    <td>
                      <span class="flex items-center gap-1 text-small text-text-secondary">
                        <Calendar class="size-4" />
                        {formatDate(registration.tournament.startDate)}
                      </span>
                    </td>
                    <td class="text-small text-text-secondary">{registration.tournament.location ?? '-'}</td>
                    <td>
                      <a href="/tournament/{registration.tournament._id}" class="btn btn-ghost btn-sm">
                        <ArrowRight class="size-4" />
                      </a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </Card>
    {/if}
  {:else}
    <Card hover={false} class="p-12">
      <div class="text-center">
        <p class="text-body text-text-secondary">Aucun profil trouve. Veuillez vous reconnecter.</p>
      </div>
    </Card>
  {/if}
</div>
