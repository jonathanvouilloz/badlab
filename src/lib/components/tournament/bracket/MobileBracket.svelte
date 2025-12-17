<script lang="ts">
  import { slide, fly } from 'svelte/transition';
  import { cn } from '$lib/utils/cn';
  import { ChevronLeft, ChevronRight, List, GitBranch } from 'lucide-svelte';
  import type { BracketData, BracketMatch } from './types';
  import { getRoundName } from './utils/layoutCalculator';
  import BracketMatchCard from './BracketMatch.svelte';

  interface Props {
    bracket: BracketData;
    isOrganizer?: boolean;
    onMatchClick?: (match: BracketMatch) => void;
  }

  let { bracket, isOrganizer = false, onMatchClick }: Props = $props();

  // Current round index (for swipeable view)
  let currentRound = $state(0);

  // View mode: 'bracket' (columns) or 'list' (chronological)
  let viewMode = $state<'bracket' | 'list'>('bracket');

  // Swipe handling
  let touchStartX = 0;
  let touchEndX = 0;
  let swiping = $state(false);

  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.changedTouches[0].screenX;
    swiping = true;
  }

  function handleTouchMove(e: TouchEvent) {
    touchEndX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd() {
    if (!swiping) return;
    swiping = false;
    handleSwipe();
  }

  function handleSwipe() {
    const threshold = 50;
    const diff = touchStartX - touchEndX;

    if (diff > threshold && currentRound < bracket.totalRounds - 1) {
      currentRound++;
    } else if (diff < -threshold && currentRound > 0) {
      currentRound--;
    }
  }

  function goToPrevRound() {
    if (currentRound > 0) currentRound--;
  }

  function goToNextRound() {
    if (currentRound < bracket.totalRounds - 1) currentRound++;
  }

  // Current round name
  let roundName = $derived(
    getRoundName(
      currentRound,
      bracket.totalRounds,
      bracket.rounds[currentRound]?.length ?? 0
    )
  );

  // Flatten matches for list view (sorted by round)
  let allMatches = $derived(
    bracket.rounds.flatMap((round, roundIdx) =>
      round.map((match) => ({
        ...match,
        roundIndex: roundIdx,
        roundName: getRoundName(roundIdx, bracket.totalRounds, round.length)
      }))
    )
  );

  // Group matches by status for list view
  let liveMatches = $derived(
    allMatches.filter((m) => m.status === 'in_progress')
  );
  let upcomingMatches = $derived(
    allMatches.filter((m) => m.status === 'pending' && m.participant1Id && m.participant2Id)
  );
  let finishedMatches = $derived(
    allMatches.filter((m) => m.status === 'finished' || m.status === 'walkover')
  );

  function toggleViewMode() {
    viewMode = viewMode === 'bracket' ? 'list' : 'bracket';
  }

  function handleMatchCardClick(match: BracketMatch) {
    onMatchClick?.(match);
  }
</script>

<div class="relative pb-20">
  <!-- FAB Toggle Button -->
  <button
    type="button"
    onclick={toggleViewMode}
    class="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-emerald-500 text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform"
    aria-label={viewMode === 'bracket' ? 'Vue liste' : 'Vue bracket'}
  >
    {#if viewMode === 'bracket'}
      <List class="size-6" />
    {:else}
      <GitBranch class="size-6" />
    {/if}
  </button>

  {#if viewMode === 'bracket'}
    <!-- Swipeable Column View -->
    <div
      class="overflow-hidden"
      ontouchstart={handleTouchStart}
      ontouchmove={handleTouchMove}
      ontouchend={handleTouchEnd}
    >
      <!-- Round Header with Navigation -->
      <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b sticky top-0 z-10">
        <button
          type="button"
          onclick={goToPrevRound}
          disabled={currentRound === 0}
          class={cn(
            'p-2 rounded-lg transition-colors',
            currentRound === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100'
          )}
          aria-label="Tour precedent"
        >
          <ChevronLeft class="size-6" />
        </button>

        <div class="text-center flex-1">
          <h3 class="font-semibold text-gray-900">{roundName}</h3>
          <p class="text-xs text-gray-500">
            {currentRound + 1} / {bracket.totalRounds}
          </p>
        </div>

        <button
          type="button"
          onclick={goToNextRound}
          disabled={currentRound === bracket.totalRounds - 1}
          class={cn(
            'p-2 rounded-lg transition-colors',
            currentRound === bracket.totalRounds - 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100'
          )}
          aria-label="Tour suivant"
        >
          <ChevronRight class="size-6" />
        </button>
      </div>

      <!-- Progress Dots -->
      <div class="flex justify-center gap-1.5 py-3 bg-gray-50/50">
        {#each bracket.rounds as _, idx}
          <button
            type="button"
            onclick={() => (currentRound = idx)}
            class={cn(
              'size-2 rounded-full transition-all',
              idx === currentRound
                ? 'bg-emerald-500 w-6'
                : 'bg-gray-300 hover:bg-gray-400'
            )}
            aria-label={`Aller au tour ${idx + 1}`}
          />
        {/each}
      </div>

      <!-- Edge Indicators -->
      {#if currentRound > 0}
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-32 bg-gradient-to-r from-emerald-500/20 to-transparent pointer-events-none flex items-center justify-start pl-1 z-10"
          transition:fly={{ x: -20, duration: 200 }}
        >
          <ChevronLeft class="size-5 text-emerald-600" />
        </div>
      {/if}
      {#if currentRound < bracket.totalRounds - 1}
        <div
          class="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-32 bg-gradient-to-l from-emerald-500/20 to-transparent pointer-events-none flex items-center justify-end pr-1 z-10"
          transition:fly={{ x: 20, duration: 200 }}
        >
          <ChevronRight class="size-5 text-emerald-600" />
        </div>
      {/if}

      <!-- Matches Container -->
      <div class="p-4">
        {#key currentRound}
          <div
            class="flex flex-col gap-4 items-center"
            transition:slide={{ duration: 200 }}
          >
            {#each bracket.rounds[currentRound] as match (match._id)}
              <BracketMatchCard
                {match}
                {isOrganizer}
                onMatchClick={handleMatchCardClick}
              />
            {/each}
          </div>
        {/key}
      </div>
    </div>
  {:else}
    <!-- Chronological List View -->
    <div class="p-4 space-y-6">
      <!-- Live Matches -->
      {#if liveMatches.length > 0}
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-red-600 flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            En cours ({liveMatches.length})
          </h3>
          <div class="space-y-3">
            {#each liveMatches as match (match._id)}
              <div class="space-y-1">
                <p class="text-xs text-gray-500 pl-1">{match.roundName}</p>
                <BracketMatchCard
                  {match}
                  {isOrganizer}
                  onMatchClick={handleMatchCardClick}
                />
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Upcoming Matches -->
      {#if upcomingMatches.length > 0}
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-600">
            A venir ({upcomingMatches.length})
          </h3>
          <div class="space-y-3">
            {#each upcomingMatches as match (match._id)}
              <div class="space-y-1">
                <p class="text-xs text-gray-500 pl-1">{match.roundName}</p>
                <BracketMatchCard
                  {match}
                  {isOrganizer}
                  onMatchClick={handleMatchCardClick}
                />
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Finished Matches -->
      {#if finishedMatches.length > 0}
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-600">
            Termines ({finishedMatches.length})
          </h3>
          <div class="space-y-3">
            {#each finishedMatches as match (match._id)}
              <div class="space-y-1">
                <p class="text-xs text-gray-500 pl-1">{match.roundName}</p>
                <BracketMatchCard
                  {match}
                  {isOrganizer}
                  onMatchClick={handleMatchCardClick}
                />
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
