<script lang="ts">
  import { useQuery } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import type { Id } from '$convex/_generated/dataModel';
  import { Trophy } from 'lucide-svelte';
  import BracketCanvas from './BracketCanvas.svelte';
  import MobileBracket from './MobileBracket.svelte';
  import ScoreModal from './ScoreModal.svelte';
  import type { BracketMatch, BracketData } from './types';
  import { useMediaQuery } from './utils/useMediaQuery.svelte';

  interface Props {
    tournamentId: Id<'tournaments'>;
    isOrganizer?: boolean;
  }

  let { tournamentId, isOrganizer = false }: Props = $props();

  // Responsive check - mobile view under 768px
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Query du bracket
  const bracketQuery = useQuery(api.bracket.getBracket, { tournamentId });

  let bracket = $derived(bracketQuery.data as BracketData | null);
  let loading = $derived(bracketQuery.isLoading);

  // Detecter si le tournoi est termine et le champion
  let finalMatch = $derived(bracket?.rounds[bracket.totalRounds - 1]?.[0]);

  let tournamentFinished = $derived(finalMatch?.status === 'finished');

  let champion = $derived(
    tournamentFinished && finalMatch
      ? finalMatch.winnerId === finalMatch.participant1?._id
        ? finalMatch.participant1
        : finalMatch.participant2
      : null
  );

  // Modal state for score editing
  let selectedMatch = $state<BracketMatch | null>(null);
  let scoreModalOpen = $state(false);

  function handleMatchClick(match: BracketMatch) {
    // Only open score modal if it's a valid match for editing
    if (
      isOrganizer &&
      match.participant1Id &&
      match.participant2Id &&
      match.status !== 'walkover'
    ) {
      selectedMatch = match;
      scoreModalOpen = true;
    }
  }

  function handleScoreSaved() {
    scoreModalOpen = false;
    selectedMatch = null;
  }
</script>

{#if loading}
  <div class="flex items-center justify-center p-8">
    <div
      class="size-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"
    ></div>
  </div>
{:else if !bracket}
  <div class="p-8 text-center text-gray-500">Aucun bracket disponible</div>
{:else}
  <!-- Banner Champion -->
  {#if champion}
    <div
      class="mx-4 md:mx-6 mt-4 p-4 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 rounded-lg text-center"
    >
      <Trophy class="size-8 mx-auto text-yellow-500 mb-2" />
      <p class="text-lg font-bold text-yellow-800">
        Champion: {champion.firstName}
        {champion.lastName}
      </p>
      <p class="text-sm text-yellow-600">Tournoi termine !</p>
    </div>
  {/if}

  <!-- Responsive Bracket View -->
  <div class="mt-4">
    {#if isMobile.current}
      <MobileBracket {bracket} {isOrganizer} onMatchClick={handleMatchClick} />
    {:else}
      <BracketCanvas {bracket} {isOrganizer} onMatchClick={handleMatchClick} />
    {/if}
  </div>

  <!-- Modal de saisie des scores -->
  {#if selectedMatch}
    <ScoreModal
      bind:open={scoreModalOpen}
      match={selectedMatch}
      onSave={handleScoreSaved}
    />
  {/if}
{/if}
