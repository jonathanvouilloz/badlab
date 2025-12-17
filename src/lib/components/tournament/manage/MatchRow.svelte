<script lang="ts">
  import type { BracketMatch } from '$lib/components/tournament/bracket/types';
  import { Pencil, Clock, CheckCircle, FastForward, Trophy } from 'lucide-svelte';

  interface Props {
    match: BracketMatch;
    canEdit: boolean;
    onEditScore: () => void;
  }

  let { match, canEdit, onEditScore }: Props = $props();

  // Participant names
  let player1Name = $derived(
    match.participant1
      ? `${match.participant1.firstName} ${match.participant1.lastName}`
      : null
  );

  let player2Name = $derived(
    match.participant2
      ? `${match.participant2.firstName} ${match.participant2.lastName}`
      : null
  );

  // Is player winner
  function isWinner(playerId: string | undefined): boolean {
    if (!playerId || !match.winnerId) return false;
    return playerId === match.winnerId;
  }

  // Status config using style guide colors
  function getStatusConfig() {
    switch (match.status) {
      case 'finished':
        return { badgeClass: 'bg-success/10 text-success border border-success/20', label: 'Termine', Icon: CheckCircle };
      case 'in_progress':
        return { badgeClass: 'bg-info/10 text-info border border-info/20', label: 'En cours', Icon: Clock };
      case 'walkover':
        return { badgeClass: 'bg-info/10 text-info border border-info/20', label: 'WO', Icon: FastForward };
      default:
        return { badgeClass: 'bg-bg-tertiary text-text-secondary border border-border whitespace-nowrap', label: 'En attente', Icon: Clock };
    }
  }

  let statusConfig = $derived(getStatusConfig());

  // Can edit this match (only if both players are set and not walkover)
  let canEditMatch = $derived(
    canEdit &&
    match.participant1Id &&
    match.participant2Id &&
    match.status !== 'walkover'
  );

  // Has scores
  let hasScores = $derived(
    match.scoreParticipant1 && match.scoreParticipant1.length > 0
  );
</script>

<tr class="hover">
  <!-- Match number -->
  <td class="text-text-muted w-12">#{match.matchNumber}</td>

  <!-- Player 1 -->
  <td class="text-right">
    {#if player1Name}
      <span class="font-medium {isWinner(match.participant1Id) ? 'text-accent' : ''}">
        {player1Name}
      </span>
      {#if isWinner(match.participant1Id)}
        <Trophy class="inline size-4 text-accent ml-1" />
      {/if}
    {:else}
      <span class="text-text-muted italic">A determiner</span>
    {/if}
  </td>

  <!-- Score -->
  <td class="text-center">
    {#if hasScores}
      <div class="flex items-center justify-center gap-1">
        {#each match.scoreParticipant1 ?? [] as score1, i}
          {@const score2 = match.scoreParticipant2?.[i] ?? 0}
          {@const p1Won = score1 > score2}
          <div class="flex flex-col items-center px-2 py-0.5 rounded bg-bg-tertiary min-w-[36px]">
            <span class="text-xs font-mono {p1Won ? 'font-bold text-accent' : 'text-text-muted'}">{score1}</span>
            <div class="w-full h-px bg-border my-0.5"></div>
            <span class="text-xs font-mono {!p1Won ? 'font-bold text-accent' : 'text-text-muted'}">{score2}</span>
          </div>
        {/each}
      </div>
    {:else if match.status === 'walkover'}
      <span class="inline-flex items-center bg-info/10 text-info border border-info/20 text-xs font-semibold px-2 py-1 rounded-md">WO</span>
    {:else}
      <span class="text-text-muted">vs</span>
    {/if}
  </td>

  <!-- Player 2 -->
  <td>
    {#if isWinner(match.participant2Id)}
      <Trophy class="inline size-4 text-accent mr-1" />
    {/if}
    {#if player2Name}
      <span class="font-medium {isWinner(match.participant2Id) ? 'text-accent' : ''}">
        {player2Name}
      </span>
    {:else}
      <span class="text-text-muted italic">A determiner</span>
    {/if}
  </td>

  <!-- Status -->
  <td>
    <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md {statusConfig.badgeClass}">
      <statusConfig.Icon class="size-3" />
      {statusConfig.label}
    </span>
  </td>

  <!-- Actions -->
  <td class="text-right">
    {#if canEditMatch}
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        onclick={onEditScore}
        aria-label={match.status === 'finished' ? 'Modifier le score' : 'Saisir le score'}
      >
        <Pencil class="size-4" />
      </button>
    {/if}
  </td>
</tr>
