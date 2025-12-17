<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { getFunctionName } from 'convex/server';
  import type { Id } from '$convex/_generated/dataModel';
  import { Card, Button, Badge } from '$lib/components/ui';
  import { Bracket } from '$lib/components/tournament';
  import { authClient } from '$lib/auth-client';
  import {
    Trophy,
    Calendar,
    Clock,
    MapPin,
    ArrowLeft,
    Settings,
    Play,
    UserPlus,
    CheckCircle,
  } from 'lucide-svelte';

  interface Props {
    data: { tournamentId: string };
  }

  let { data }: Props = $props();

  // Auth state
  const session = authClient.useSession();
  const appUserQuery = useQuery(api.users.getCurrentAppUser, {});

  // Tournament data
  const tournamentQuery = useQuery(
    api.tournaments.getById,
    { id: data.tournamentId as Id<'tournaments'> }
  );

  const participantsQuery = useQuery(
    api.participants.getByTournament,
    { tournamentId: data.tournamentId as Id<'tournaments'> }
  );

  // Bracket data (pour savoir si la finale est terminee)
  const bracketQuery = useQuery(
    api.bracket.getBracket,
    { tournamentId: data.tournamentId as Id<'tournaments'> }
  );

  // Derived states
  let tournament = $derived(tournamentQuery.data);
  let participants = $derived(participantsQuery.data ?? []);
  let appUser = $derived(appUserQuery.data);
  let loading = $derived(tournamentQuery.isLoading);
  let isOwner = $derived(tournament && appUser && tournament.organizerId === appUser._id);

  // Verifier si la finale est terminee (pour afficher le bouton de cloture)
  let bracket = $derived(bracketQuery.data);
  let finalMatch = $derived(
    bracket?.rounds?.[bracket.totalRounds - 1]?.[0]
  );
  let isFinalFinished = $derived(finalMatch?.status === 'finished');

  // Convex client for mutations
  const convexClient = useConvexClient();

  // State for starting tournament
  let startingTournament = $state(false);
  let startError = $state('');

  // State for finalizing tournament
  let finalizingTournament = $state(false);

  // Pagination state for participants table
  let currentPage = $state(1);
  const pageSize = 10;
  let totalPages = $derived(Math.ceil(participants.length / pageSize));
  let paginatedParticipants = $derived(
    participants.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  );

  // Start tournament handler
  async function handleStartTournament() {
    if (!tournament) return;

    startingTournament = true;
    startError = '';

    try {
      await convexClient.mutation(
        getFunctionName(api.bracket.startTournament),
        { tournamentId: tournament._id }
      );
    } catch (error) {
      console.error('Erreur lors du lancement:', error);
      startError = error instanceof Error ? error.message : 'Erreur lors du lancement du tournoi';
    } finally {
      startingTournament = false;
    }
  }

  // Finalize tournament handler
  async function handleFinalizeTournament() {
    if (!tournament) return;

    finalizingTournament = true;

    try {
      await convexClient.mutation(
        getFunctionName(api.bracket.finalizeTournament),
        { tournamentId: tournament._id }
      );
    } catch (error) {
      console.error('Erreur lors de la cloture:', error);
    } finally {
      finalizingTournament = false;
    }
  }

  // Format helpers
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function getStatusVariant(status: string): 'success' | 'warning' | 'info' | 'neutral' | 'danger' {
    switch (status) {
      case 'registration_open':
        return 'success';
      case 'in_progress':
        return 'info'; // Changed from 'warning' to 'info' per styleguide
      case 'finished':
        return 'success'; // Changed from 'neutral' to 'success' per styleguide
      case 'draft':
        return 'neutral';
      default:
        return 'neutral';
    }
  }

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

  function getFormatLabel(format: string): string {
    switch (format) {
      case 'elimination':
        return 'Elimination directe';
      case 'pools_elimination':
        return 'Poules + Elimination';
      case 'round_robin':
        return 'Round Robin';
      case 'swiss':
        return 'Systeme Suisse';
      default:
        return format;
    }
  }

  function getTypeLabel(type: string): string {
    switch (type) {
      case 'single':
        return 'Simple';
      case 'double':
        return 'Double';
      case 'mixed':
        return 'Mixte';
      default:
        return type;
    }
  }
</script>

<svelte:head>
  <title>{tournament?.name ?? 'Tournoi'} - BadLab</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-8">
  {#if loading}
    <Card hover={false} class="p-12">
      <div class="flex flex-col items-center justify-center gap-4">
        <div class="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p class="text-body text-text-secondary">Chargement du tournoi...</p>
      </div>
    </Card>
  {:else if !tournament}
    <Card hover={false} class="p-12">
      <div class="flex flex-col items-center justify-center gap-4 text-center">
        <div class="size-16 rounded-2xl bg-danger/10 flex items-center justify-center">
          <Trophy class="size-8 text-danger" />
        </div>
        <h2 class="heading-2 text-text-primary">Tournoi introuvable</h2>
        <p class="text-body text-text-secondary">Ce tournoi n'existe pas ou a ete supprime.</p>
        <a href="/dashboard">
          <Button variant="secondary">
            <ArrowLeft class="size-5" />
            Retour au tableau de bord
          </Button>
        </a>
      </div>
    </Card>
  {:else}
    <!-- Header -->
    <div class="mb-8">
      <a href="/dashboard" class="inline-flex items-center gap-2 text-text-secondary hover:text-accent mb-4">
        <ArrowLeft class="size-4" />
        Retour
      </a>

      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <!-- Left: Title, status, date -->
        <div>
          <h1 class="heading-1 text-text-primary mb-2">{tournament.name}</h1>
          <div class="flex flex-wrap items-center gap-4 text-small text-text-secondary">
            <Badge variant={getStatusVariant(tournament.status)} pulse={tournament.status === 'in_progress'}>
              {getStatusLabel(tournament.status)}
            </Badge>
            <span class="flex items-center gap-1">
              <Calendar class="size-4" />
              {formatDate(tournament.startDate)}
            </span>
            {#if tournament.startTime}
              <span class="flex items-center gap-1">
                <Clock class="size-4" />
                {tournament.startTime}
              </span>
            {/if}
            {#if tournament.location}
              <span class="flex items-center gap-1">
                <MapPin class="size-4" />
                {tournament.location}
              </span>
            {/if}
          </div>
        </div>

        <!-- Right: Tournament details + actions -->
        <div class="flex flex-col items-end gap-3">
          <!-- Tournament details inline -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-text-secondary">
            <span><span class="text-text-muted">Format:</span> <span class="text-text-primary font-medium">{getFormatLabel(tournament.format)}</span></span>
            <span><span class="text-text-muted">Type:</span> <span class="text-text-primary font-medium">{getTypeLabel(tournament.tournamentType)}</span></span>
            <span><span class="text-text-muted">Joueurs:</span> <span class="text-text-primary font-medium">{participants.length}{tournament.maxParticipants ? `/${tournament.maxParticipants}` : ''}</span></span>
            {#if tournament.nbCourts}
              <span><span class="text-text-muted">Terrains:</span> <span class="text-text-primary font-medium">{tournament.nbCourts}</span></span>
            {/if}
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            {#if isOwner}
              {#if tournament.status === 'draft'}
                <Button
                  variant="primary"
                  size="sm"
                  onclick={handleStartTournament}
                  disabled={startingTournament || participants.length < 2}
                >
                  {#if startingTournament}
                    <div class="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Lancement...
                  {:else}
                    <Play class="size-4" />
                    Lancer le tournoi
                  {/if}
                </Button>
              {/if}
              {#if tournament.status === 'in_progress' && isFinalFinished}
                <Button
                  variant="primary"
                  size="sm"
                  onclick={handleFinalizeTournament}
                  disabled={finalizingTournament}
                >
                  {#if finalizingTournament}
                    <div class="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Cloture...
                  {:else}
                    <CheckCircle class="size-4" />
                    Cloturer le tournoi
                  {/if}
                </Button>
              {/if}
              <a href="/tournament/{tournament._id}/manage">
                <Button variant="secondary" size="sm">
                  <Settings class="size-4" />
                  Gerer
                </Button>
              </a>
            {:else if tournament.status === 'registration_open' && tournament.inscriptionType === 'open'}
              <a href="/register/{tournament._id}">
                <Button size="sm">
                  <UserPlus class="size-4" />
                  S'inscrire
                </Button>
              </a>
            {/if}
          </div>

          {#if isOwner}
            {#if startError}
              <p class="text-small text-danger">{startError}</p>
            {/if}
            {#if tournament.status === 'draft' && participants.length < 2}
              <p class="text-small text-text-muted">Minimum 2 participants requis</p>
            {/if}
          {/if}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-6">
        <!-- Description -->
        {#if tournament.description}
          <Card hover={false}>
            <h2 class="heading-3 text-text-primary mb-2">Description</h2>
            <p class="text-body text-text-secondary whitespace-pre-wrap">{tournament.description}</p>
          </Card>
        {/if}

        <!-- Participants -->
        <Card hover={false} padding="none">
          <div class="p-4 border-b border-border flex items-center justify-between">
            <h2 class="heading-3 text-text-primary">Participants ({participants.length})</h2>
            {#if isOwner && tournament.status === 'draft'}
              <a href="/tournament/{tournament._id}/manage">
                <Button variant="secondary" size="sm">
                  <UserPlus class="size-4" />
                  Gerer
                </Button>
              </a>
            {/if}
          </div>

          {#if participants.length === 0}
            <div class="p-8 text-center">
              <p class="text-body text-text-secondary">Aucun participant pour le moment.</p>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th class="w-12">#</th>
                    <th>Nom</th>
                    <th>Niveau</th>
                  </tr>
                </thead>
                <tbody>
                  {#each paginatedParticipants as participant, i}
                    <tr class="hover">
                      <td class="text-text-muted">{(currentPage - 1) * pageSize + i + 1}</td>
                      <td class="font-medium">{participant.firstName} {participant.lastName}</td>
                      <td class="capitalize text-text-muted">{participant.level ?? '-'}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            {#if totalPages > 1}
              <div class="flex justify-center items-center gap-2 p-3 border-t border-border">
                <button
                  type="button"
                  class="btn btn-xs btn-ghost"
                  disabled={currentPage === 1}
                  onclick={() => currentPage--}
                >
                  &laquo;
                </button>
                <span class="text-small text-text-secondary">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  class="btn btn-xs btn-ghost"
                  disabled={currentPage === totalPages}
                  onclick={() => currentPage++}
                >
                  &raquo;
                </button>
              </div>
            {/if}
          {/if}
        </Card>

        <!-- Bracket (quand le tournoi est lance) -->
        {#if tournament.status === 'in_progress' || tournament.status === 'finished'}
          <Card hover={false} padding="none">
            <div class="p-4 border-b border-border">
              <h2 class="heading-3 text-text-primary">Bracket</h2>
            </div>
            <Bracket tournamentId={tournament._id} isOrganizer={isOwner ?? false} />
          </Card>
        {/if}
    </div>
  {/if}
</div>
