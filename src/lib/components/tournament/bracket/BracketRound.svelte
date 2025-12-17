<script lang="ts">
  import BracketMatch from './BracketMatch.svelte';
  import type { BracketMatch as BracketMatchType } from './types';

  interface Props {
    matches: BracketMatchType[];
    roundIndex: number;
    totalRounds: number;
    isOrganizer?: boolean;
    onMatchClick?: (match: BracketMatchType) => void;
  }

  let { matches, roundIndex, totalRounds, isOrganizer = false, onMatchClick }: Props = $props();

  // Nom du round
  function getRoundName(index: number, total: number): string {
    const roundNumber = index + 1;
    const matchesInRound = matches.length;

    // Finale
    if (roundNumber === total) {
      return 'Finale';
    }

    // Demi-finales
    if (roundNumber === total - 1 && matchesInRound === 2) {
      return 'Demi-finales';
    }

    // Quarts de finale
    if (roundNumber === total - 2 && matchesInRound === 4) {
      return 'Quarts';
    }

    // Huitiemes
    if (matchesInRound === 8) {
      return '8emes';
    }

    // Autres tours
    return `Tour ${roundNumber}`;
  }

  let roundName = $derived(getRoundName(roundIndex, totalRounds));

  // Espacement entre les matchs (double a chaque tour)
  // Tour 1: 16px, Tour 2: 48px, Tour 3: 112px, etc.
  let gap = $derived(16 * Math.pow(2, roundIndex + 1) - 16);
</script>

<div class="flex flex-col items-center">
  <!-- Titre du round -->
  <h3 class="text-sm font-semibold text-text-secondary mb-4 whitespace-nowrap">
    {roundName}
  </h3>

  <!-- Matchs du round -->
  <div
    class="flex flex-col justify-around h-full"
    style="gap: {gap}px; min-height: {matches.length * 80 + (matches.length - 1) * gap}px"
  >
    {#each matches as match (match._id)}
      <BracketMatch {match} {isOrganizer} {onMatchClick} />
    {/each}
  </div>
</div>
