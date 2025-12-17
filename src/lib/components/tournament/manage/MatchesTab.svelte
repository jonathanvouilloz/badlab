<script lang="ts">
  import type { Id } from '$convex/_generated/dataModel';
  import type { BracketData, BracketMatch } from '$lib/components/tournament/bracket/types';
  import { Card } from '$lib/components/ui';
  import { Swords, Filter, Trophy } from 'lucide-svelte';
  import MatchRow from './MatchRow.svelte';
  import ScoreModal from '$lib/components/tournament/bracket/ScoreModal.svelte';

  interface Props {
    tournamentId: Id<'tournaments'>;
    bracket: BracketData;
    isFinished: boolean;
  }

  let { tournamentId, bracket, isFinished }: Props = $props();

  // Filter state
  type FilterStatus = 'all' | 'pending' | 'finished';
  let filterStatus = $state<FilterStatus>('all');

  // Score modal state
  let showScoreModal = $state(false);
  let selectedMatch = $state<BracketMatch | null>(null);

  // Get round name
  function getRoundName(roundIndex: number, totalRounds: number): string {
    const roundsFromEnd = totalRounds - roundIndex;
    switch (roundsFromEnd) {
      case 1:
        return 'Finale';
      case 2:
        return 'Demi-finales';
      case 3:
        return 'Quarts de finale';
      case 4:
        return 'Huitiemes de finale';
      default:
        return `Round ${roundIndex + 1}`;
    }
  }

  // Filter matches
  function filterMatches(matches: BracketMatch[]): BracketMatch[] {
    if (filterStatus === 'all') return matches;
    if (filterStatus === 'pending') {
      return matches.filter(m => m.status === 'pending' || m.status === 'in_progress');
    }
    return matches.filter(m => m.status === 'finished' || m.status === 'walkover');
  }

  // Count matches by status
  let pendingCount = $derived(
    bracket.rounds.flat().filter(m => m.status === 'pending' || m.status === 'in_progress').length
  );
  let finishedCount = $derived(
    bracket.rounds.flat().filter(m => m.status === 'finished' || m.status === 'walkover').length
  );
  let totalCount = $derived(bracket.rounds.flat().length);

  // Open score modal
  function handleEditScore(match: BracketMatch) {
    selectedMatch = match;
    showScoreModal = true;
  }

  // Score saved callback
  function handleScoreSaved() {
    showScoreModal = false;
    selectedMatch = null;
  }
</script>

<div class="space-y-6">
  <!-- Stats & Filters -->
  <Card hover={false}>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="size-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Swords class="size-5 text-accent" />
        </div>
        <div>
          <h2 class="font-semibold text-text-primary">Matchs</h2>
          <p class="text-sm text-text-secondary">
            {finishedCount} termine{finishedCount !== 1 ? 's' : ''} / {totalCount} matchs
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-2">
        <Filter class="size-4 text-text-muted" />
        <div class="join">
          <button
            type="button"
            class="btn btn-sm join-item {filterStatus === 'all' ? 'btn-active' : ''}"
            onclick={() => filterStatus = 'all'}
          >
            Tous ({totalCount})
          </button>
          <button
            type="button"
            class="btn btn-sm join-item {filterStatus === 'pending' ? 'btn-active' : ''}"
            onclick={() => filterStatus = 'pending'}
          >
            En attente ({pendingCount})
          </button>
          <button
            type="button"
            class="btn btn-sm join-item {filterStatus === 'finished' ? 'btn-active' : ''}"
            onclick={() => filterStatus = 'finished'}
          >
            Termines ({finishedCount})
          </button>
        </div>
      </div>
    </div>
  </Card>

  <!-- Matches by Round -->
  {#each bracket.rounds as roundMatches, roundIndex}
    {@const filteredMatches = filterMatches(roundMatches)}
    {#if filteredMatches.length > 0}
      <Card hover={false} padding="none">
        <div class="p-4 border-b border-border bg-bg-secondary">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              {#if roundIndex === bracket.totalRounds - 1}
                <Trophy class="size-5 text-accent" />
              {/if}
              <h3 class="font-semibold text-text-primary">
                {getRoundName(roundIndex, bracket.totalRounds)}
              </h3>
            </div>
            <span class="inline-flex items-center bg-bg-tertiary text-text-secondary border border-border text-xs font-semibold px-2 py-1 rounded-md">
              {filteredMatches.length} match{filteredMatches.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th class="w-16">#</th>
                <th class="text-right">Joueur 1</th>
                <th class="text-center w-40">Score</th>
                <th>Joueur 2</th>
                <th class="w-28">Statut</th>
                <th class="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {#each filteredMatches as match}
                <MatchRow
                  {match}
                  canEdit={!isFinished}
                  onEditScore={() => handleEditScore(match)}
                />
              {/each}
            </tbody>
          </table>
        </div>
      </Card>
    {/if}
  {/each}

  <!-- Empty state when filtered -->
  {#if bracket.rounds.every(round => filterMatches(round).length === 0)}
    <Card hover={false} class="p-8 text-center">
      <p class="text-text-muted">Aucun match ne correspond au filtre.</p>
    </Card>
  {/if}
</div>

<!-- Score Modal -->
{#if selectedMatch}
  <ScoreModal
    bind:open={showScoreModal}
    match={selectedMatch}
    onSave={handleScoreSaved}
  />
{/if}
