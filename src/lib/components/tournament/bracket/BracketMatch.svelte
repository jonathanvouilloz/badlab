<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { BracketMatch } from './types';

  interface Props {
    match: BracketMatch;
    isOrganizer?: boolean;
    onMatchClick?: (match: BracketMatch) => void;
  }

  let { match, isOrganizer = false, onMatchClick }: Props = $props();

  // Detecter si c'est un match d'equipes
  let isTeamMatch = $derived(match.team1Id || match.team2Id);

  // Noms des participants ou equipes
  // Utiliser participant1DisplayName si disponible (calcule par le backend)
  let participant1Name = $derived(
    (match as any).participant1DisplayName ||
    (match.participant1
      ? `${match.participant1.firstName} ${match.participant1.lastName}`
      : null)
  );

  let participant2Name = $derived(
    (match as any).participant2DisplayName ||
    (match.participant2
      ? `${match.participant2.firstName} ${match.participant2.lastName}`
      : null)
  );

  // Vainqueurs - gerer les cas equipes et participants
  let isWinner1 = $derived(
    match.winnerId && (
      (match.participant1Id && match.participant1Id === match.winnerId) ||
      (match.team1Id && match.team1Id === match.winnerId)
    )
  );
  let isWinner2 = $derived(
    match.winnerId && (
      (match.participant2Id && match.participant2Id === match.winnerId) ||
      (match.team2Id && match.team2Id === match.winnerId)
    )
  );

  // Scores formates
  function formatScore(scores?: number[]): string {
    if (!scores || scores.length === 0) return '';
    return scores.join('-');
  }

  let score1 = $derived(formatScore(match.scoreParticipant1));
  let score2 = $derived(formatScore(match.scoreParticipant2));

  // Le match est-il cliquable ?
  // Organisateur peut cliquer sur un match:
  // - avec les 2 participants/equipes definis
  // - qui n'est pas un walkover
  // - soit pour saisir le score (pending/in_progress) soit pour modifier (finished)
  let hasEntity1 = $derived(match.participant1Id || match.team1Id);
  let hasEntity2 = $derived(match.participant2Id || match.team2Id);

  let isClickable = $derived(
    isOrganizer &&
    hasEntity1 &&
    hasEntity2 &&
    match.status !== 'walkover'
  );

  // Mode edition (match deja termine)
  let isEditMode = $derived(match.status === 'finished');

  // Le match est-il en attente de joueurs/equipes ?
  let isPending = $derived(!hasEntity1 || !hasEntity2);

  function handleClick() {
    if (isClickable && onMatchClick) {
      onMatchClick(match);
    }
  }
</script>

<button
  type="button"
  class={cn(
    'w-52 bg-white border rounded-lg overflow-hidden transition-all duration-200',
    isClickable && !isEditMode && 'hover:border-accent hover:shadow-md cursor-pointer',
    isClickable && isEditMode && 'hover:border-info hover:shadow-md cursor-pointer',
    !isClickable && 'cursor-default',
    isPending && 'opacity-60',
    match.status === 'finished' && 'border-success/50',
    match.status === 'walkover' && 'border-warning/50'
  )}
  onclick={handleClick}
  disabled={!isClickable}
>
  <!-- Joueur 1 -->
  <div
    class={cn(
      'flex items-center justify-between px-3 py-2 border-b border-border',
      isWinner1 && 'bg-success/10'
    )}
  >
    <span class="text-sm font-medium truncate flex-1 text-left">
      {#if participant1Name}
        {participant1Name}
      {:else if match.status === 'walkover' && !match.participant1Id}
        <span class="text-text-muted italic">BYE</span>
      {:else}
        <span class="text-text-muted">A determiner</span>
      {/if}
    </span>
    {#if score1}
      <span class="text-sm font-bold ml-2 text-text-primary">{score1}</span>
    {/if}
    {#if isWinner1}
      <span class="ml-1 text-success text-xs">&#10003;</span>
    {/if}
  </div>

  <!-- Joueur 2 -->
  <div
    class={cn(
      'flex items-center justify-between px-3 py-2',
      isWinner2 && 'bg-success/10'
    )}
  >
    <span class="text-sm font-medium truncate flex-1 text-left">
      {#if participant2Name}
        {participant2Name}
      {:else if match.status === 'walkover' && !match.participant2Id}
        <span class="text-text-muted italic">BYE</span>
      {:else}
        <span class="text-text-muted">A determiner</span>
      {/if}
    </span>
    {#if score2}
      <span class="text-sm font-bold ml-2 text-text-primary">{score2}</span>
    {/if}
    {#if isWinner2}
      <span class="ml-1 text-success text-xs">&#10003;</span>
    {/if}
  </div>

  <!-- Indicateur de statut -->
  {#if match.status === 'walkover'}
    <div class="px-3 py-1 bg-warning/10 text-warning text-xs text-center">
      Exempt
    </div>
  {:else if match.status === 'finished'}
    <div class="px-3 py-1 bg-success/10 text-success text-xs text-center">
      {#if isClickable}
        Cliquer pour modifier
      {:else}
        Termine
      {/if}
    </div>
  {/if}
</button>
