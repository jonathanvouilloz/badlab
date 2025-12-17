<script lang="ts">
  import { fly } from 'svelte/transition';
  import { cn } from '$lib/utils/cn';
  import { X, Users, Trophy, Clock, Calendar } from 'lucide-svelte';
  import type { BracketMatch } from './types';

  interface Props {
    open: boolean;
    match: BracketMatch | null;
    onclose?: () => void;
  }

  let { open = $bindable(false), match, onclose }: Props = $props();

  // Participant names
  let p1Name = $derived(
    match?.participant1
      ? `${match.participant1.firstName} ${match.participant1.lastName}`
      : 'A determiner'
  );
  let p2Name = $derived(
    match?.participant2
      ? `${match.participant2.firstName} ${match.participant2.lastName}`
      : 'A determiner'
  );

  // Winner detection
  let isWinner1 = $derived(
    match?.winnerId && match?.participant1Id === match?.winnerId
  );
  let isWinner2 = $derived(
    match?.winnerId && match?.participant2Id === match?.winnerId
  );

  // Format scores for display
  function formatScores(
    scores1?: number[],
    scores2?: number[]
  ): { set: number; s1: number; s2: number }[] {
    if (!scores1 || !scores2) return [];
    return scores1.map((s1, i) => ({
      set: i + 1,
      s1,
      s2: scores2[i] ?? 0
    }));
  }

  let sets = $derived(
    formatScores(match?.scoreParticipant1, match?.scoreParticipant2)
  );

  function handleClose() {
    open = false;
    onclose?.();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open && match}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
    onclick={handleBackdropClick}
    role="presentation"
    transition:fly={{ duration: 200, opacity: 0 }}
  >
    <!-- Drawer -->
    <div
      class="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
      transition:fly={{ x: 400, duration: 300 }}
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b shrink-0">
        <h2 class="text-lg font-bold text-gray-900">Details du match</h2>
        <button
          type="button"
          onclick={handleClose}
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Fermer"
        >
          <X class="size-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 p-6 space-y-6 overflow-y-auto">
        <!-- Match Status -->
        <div class="text-center">
          <span
            class={cn(
              'inline-block px-3 py-1 rounded-full text-sm font-medium',
              match.status === 'pending' && 'bg-gray-100 text-gray-600',
              match.status === 'in_progress' && 'bg-red-100 text-red-600',
              match.status === 'finished' && 'bg-green-100 text-green-600',
              match.status === 'walkover' && 'bg-amber-100 text-amber-600'
            )}
          >
            {#if match.status === 'pending'}
              A venir
            {:else if match.status === 'in_progress'}
              En cours
            {:else if match.status === 'finished'}
              Termine
            {:else if match.status === 'walkover'}
              Exempt
            {:else}
              {match.status}
            {/if}
          </span>
        </div>

        <!-- Players Cards -->
        <div class="space-y-4">
          <!-- Player 1 -->
          <div
            class={cn(
              'p-4 rounded-lg border-2 transition-colors',
              isWinner1
                ? 'bg-green-50 border-green-400'
                : 'bg-white border-gray-200'
            )}
          >
            <div class="flex items-center gap-3">
              <div
                class={cn(
                  'size-12 rounded-full flex items-center justify-center',
                  isWinner1 ? 'bg-green-100' : 'bg-gray-100'
                )}
              >
                {#if isWinner1}
                  <Trophy class="size-6 text-green-600" />
                {:else}
                  <Users class="size-6 text-gray-500" />
                {/if}
              </div>
              <div class="flex-1">
                <p
                  class={cn(
                    'font-semibold',
                    isWinner1 ? 'text-green-700' : 'text-gray-900'
                  )}
                >
                  {p1Name}
                </p>
                {#if match.participant1?.level}
                  <p class="text-sm text-gray-500 capitalize">
                    {match.participant1.level}
                  </p>
                {/if}
              </div>
              {#if match.scoreParticipant1}
                <div class="text-right">
                  <p class="text-lg font-bold tabular-nums">
                    {match.scoreParticipant1.join('-')}
                  </p>
                </div>
              {/if}
            </div>
          </div>

          <!-- VS Separator -->
          <div class="text-center text-gray-400 text-sm font-medium">VS</div>

          <!-- Player 2 -->
          <div
            class={cn(
              'p-4 rounded-lg border-2 transition-colors',
              isWinner2
                ? 'bg-green-50 border-green-400'
                : 'bg-white border-gray-200'
            )}
          >
            <div class="flex items-center gap-3">
              <div
                class={cn(
                  'size-12 rounded-full flex items-center justify-center',
                  isWinner2 ? 'bg-green-100' : 'bg-gray-100'
                )}
              >
                {#if isWinner2}
                  <Trophy class="size-6 text-green-600" />
                {:else}
                  <Users class="size-6 text-gray-500" />
                {/if}
              </div>
              <div class="flex-1">
                <p
                  class={cn(
                    'font-semibold',
                    isWinner2 ? 'text-green-700' : 'text-gray-900'
                  )}
                >
                  {p2Name}
                </p>
                {#if match.participant2?.level}
                  <p class="text-sm text-gray-500 capitalize">
                    {match.participant2.level}
                  </p>
                {/if}
              </div>
              {#if match.scoreParticipant2}
                <div class="text-right">
                  <p class="text-lg font-bold tabular-nums">
                    {match.scoreParticipant2.join('-')}
                  </p>
                </div>
              {/if}
            </div>
          </div>
        </div>

        <!-- Score Details by Set -->
        {#if sets.length > 0}
          <div class="space-y-3">
            <h3 class="font-semibold text-gray-900">Score par set</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-3 gap-2 text-center text-sm">
                <!-- Header -->
                <div class="font-medium text-gray-600 truncate">
                  {p1Name.split(' ')[0]}
                </div>
                <div class="text-gray-400">Set</div>
                <div class="font-medium text-gray-600 truncate">
                  {p2Name.split(' ')[0]}
                </div>

                <!-- Sets -->
                {#each sets as set}
                  <div
                    class={cn(
                      'py-2 rounded font-bold tabular-nums',
                      set.s1 > set.s2
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600'
                    )}
                  >
                    {set.s1}
                  </div>
                  <div class="py-2 text-gray-400">{set.set}</div>
                  <div
                    class={cn(
                      'py-2 rounded font-bold tabular-nums',
                      set.s2 > set.s1
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600'
                    )}
                  >
                    {set.s2}
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {/if}

        <!-- Match Info -->
        <div class="space-y-3">
          <h3 class="font-semibold text-gray-900">Informations</h3>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-gray-600">
              <Calendar class="size-4" />
              <span>Tour {match.round}</span>
              {#if match.phase}
                <span class="text-gray-400">-</span>
                <span class="capitalize">{match.phase}</span>
              {/if}
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <Clock class="size-4" />
              <span>Match #{match.matchNumber}</span>
            </div>
          </div>
        </div>

        <!-- Placeholder for future features -->
        <div class="p-4 bg-gray-50 rounded-lg text-center border border-dashed border-gray-200">
          <p class="text-gray-400 text-sm">
            Chat et commentaires bientot disponibles
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}
