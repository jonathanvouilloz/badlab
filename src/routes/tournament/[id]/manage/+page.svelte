<script lang="ts">
  import { goto } from '$app/navigation';
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { getFunctionName } from 'convex/server';
  import type { Id } from '$convex/_generated/dataModel';
  import { Card, Button, Badge, ConfirmModal } from '$lib/components/ui';
  import { toasts } from '$lib/stores/toast';
  import { authClient } from '$lib/auth-client';
  import {
    ArrowLeft,
    Users,
    Swords,
    Play,
    CheckCircle,
    Trash2,
  } from 'lucide-svelte';
  import ParticipantsTab from '$lib/components/tournament/manage/ParticipantsTab.svelte';
  import MatchesTab from '$lib/components/tournament/manage/MatchesTab.svelte';

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

  const bracketQuery = useQuery(
    api.bracket.getBracket,
    { tournamentId: data.tournamentId as Id<'tournaments'> }
  );

  // Derived states
  let tournament = $derived(tournamentQuery.data);
  let participants = $derived(participantsQuery.data ?? []);
  let bracket = $derived(bracketQuery.data);
  let appUser = $derived(appUserQuery.data);
  let loading = $derived(tournamentQuery.isLoading);
  let isOwner = $derived(tournament && appUser && tournament.organizerId === appUser._id);

  // Check if final is finished
  let finalMatch = $derived(
    bracket?.rounds?.[bracket.totalRounds - 1]?.[0]
  );
  let isFinalFinished = $derived(finalMatch?.status === 'finished');

  // Tabs
  type Tab = 'participants' | 'matches';
  let activeTab = $state<Tab>('participants');

  // Show matches tab only if tournament is in_progress or finished
  let showMatchesTab = $derived(
    tournament?.status === 'in_progress' || tournament?.status === 'finished'
  );

  // Auto-switch to matches tab when tournament starts
  $effect(() => {
    if (showMatchesTab && activeTab === 'participants') {
      // Keep on participants by default, user can switch
    }
  });

  // Convex client for mutations
  const convexClient = useConvexClient();

  // State for actions
  let startingTournament = $state(false);
  let finalizingTournament = $state(false);
  let deletingTournament = $state(false);
  let showDeleteModal = $state(false);
  let actionError = $state('');

  // Start tournament handler
  async function handleStartTournament() {
    if (!tournament) return;

    startingTournament = true;
    actionError = '';

    try {
      await convexClient.mutation(
        getFunctionName(api.bracket.startTournament),
        { tournamentId: tournament._id }
      );
      activeTab = 'matches';
    } catch (error) {
      console.error('Erreur lors du lancement:', error);
      actionError = error instanceof Error ? error.message : 'Erreur lors du lancement du tournoi';
    } finally {
      startingTournament = false;
    }
  }

  // Finalize tournament handler
  async function handleFinalizeTournament() {
    if (!tournament) return;

    finalizingTournament = true;
    actionError = '';

    try {
      await convexClient.mutation(
        getFunctionName(api.bracket.finalizeTournament),
        { tournamentId: tournament._id }
      );
    } catch (error) {
      console.error('Erreur lors de la cloture:', error);
      actionError = error instanceof Error ? error.message : 'Erreur lors de la cloture';
    } finally {
      finalizingTournament = false;
    }
  }

  // Delete tournament handler
  async function handleDeleteTournament() {
    if (!tournament) return;

    deletingTournament = true;
    actionError = '';

    try {
      await convexClient.mutation(
        getFunctionName(api.tournaments.remove),
        { id: tournament._id }
      );
      showDeleteModal = false;
      toasts.success('Tournoi supprime avec succes');
      goto('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      actionError = error instanceof Error ? error.message : 'Erreur lors de la suppression';
      toasts.error('Erreur lors de la suppression du tournoi');
    } finally {
      deletingTournament = false;
    }
  }

  // Format helpers
  function getStatusVariant(status: string): 'success' | 'info' | 'neutral' | 'danger' {
    switch (status) {
      case 'registration_open':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'finished':
        return 'success';
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
</script>

<svelte:head>
  <title>Gerer {tournament?.name ?? 'Tournoi'} - BadLab</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-8">
  {#if loading}
    <Card hover={false} class="p-12">
      <div class="flex flex-col items-center justify-center gap-4">
        <div class="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p class="text-body text-text-secondary">Chargement...</p>
      </div>
    </Card>
  {:else if !tournament}
    <Card hover={false} class="p-12">
      <div class="flex flex-col items-center justify-center gap-4 text-center">
        <h2 class="heading-3 text-text-primary">Tournoi introuvable</h2>
        <a href="/dashboard">
          <Button variant="secondary">
            <ArrowLeft class="size-5" />
            Retour au tableau de bord
          </Button>
        </a>
      </div>
    </Card>
  {:else if !isOwner}
    <Card hover={false} class="p-12">
      <div class="flex flex-col items-center justify-center gap-4 text-center">
        <h2 class="heading-3 text-text-primary">Acces refuse</h2>
        <p class="text-body text-text-secondary">Vous n'etes pas l'organisateur de ce tournoi.</p>
        <a href="/tournament/{tournament._id}">
          <Button variant="secondary">
            <ArrowLeft class="size-5" />
            Voir le tournoi
          </Button>
        </a>
      </div>
    </Card>
  {:else}
    <!-- Header -->
    <div class="mb-6">
      <a href="/tournament/{tournament._id}" class="inline-flex items-center gap-2 text-small text-text-secondary hover:text-accent mb-4 transition-colors">
        <ArrowLeft class="size-4" />
        Retour au tournoi
      </a>

      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 class="heading-2 text-text-primary mb-1">Gerer: {tournament.name}</h1>
          <div class="flex flex-wrap items-center gap-3 text-small text-text-secondary">
            <Badge variant={getStatusVariant(tournament.status)} pulse={tournament.status === 'in_progress'}>
              {getStatusLabel(tournament.status)}
            </Badge>
            <span>{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2">
          <div class="flex items-center gap-2">
            {#if tournament.status === 'draft'}
              <Button
                variant="primary"
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
            <Button
              variant="danger"
              size="sm"
              onclick={() => showDeleteModal = true}
            >
              <Trash2 class="size-4" />
              Supprimer
            </Button>
          </div>
          {#if actionError}
            <p class="text-small text-danger">{actionError}</p>
          {/if}
          {#if tournament.status === 'draft' && participants.length < 2}
            <p class="text-small text-text-muted">Minimum 2 participants requis</p>
          {/if}
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div role="tablist" class="tabs tabs-bordered mb-6">
      <button
        role="tab"
        type="button"
        class="tab tab-lg gap-2 {activeTab === 'participants' ? 'tab-active text-accent border-accent' : 'text-text-secondary'}"
        onclick={() => activeTab = 'participants'}
      >
        <Users class="size-4" />
        Participants
      </button>
      {#if showMatchesTab}
        <button
          role="tab"
          type="button"
          class="tab tab-lg gap-2 {activeTab === 'matches' ? 'tab-active text-accent border-accent' : 'text-text-secondary'}"
          onclick={() => activeTab = 'matches'}
        >
          <Swords class="size-4" />
          Matchs
        </button>
      {/if}
    </div>

    <!-- Tab Content -->
    {#if activeTab === 'participants'}
      <ParticipantsTab
        tournamentId={tournament._id}
        {participants}
        isDraft={tournament.status === 'draft'}
      />
    {:else if activeTab === 'matches' && bracket}
      <MatchesTab
        tournamentId={tournament._id}
        {bracket}
        isFinished={tournament.status === 'finished'}
      />
    {/if}
  {/if}
</div>

<!-- Modal de confirmation de suppression -->
<ConfirmModal
  bind:open={showDeleteModal}
  title="Supprimer le tournoi ?"
  message="Cette action est irreversible. Tous les participants, matchs et donnees associes seront supprimes definitivement."
  confirmText="Supprimer"
  cancelText="Annuler"
  variant="danger"
  loading={deletingTournament}
  onconfirm={handleDeleteTournament}
/>
