<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import { cn } from '$lib/utils/cn';
  import type { MatchNodeData } from './types';

  interface Props {
    id: string;
    data: MatchNodeData;
    selected?: boolean;
  }

  let { id, data, selected = false }: Props = $props();

  // Derived values from data
  let match = $derived(data.match);
  let isOrganizer = $derived(data.isOrganizer);
  let isHighlighted = $derived(data.isHighlighted);
  let isDimmed = $derived(data.isDimmed);

  // Participant names
  let p1Name = $derived(
    match.participant1
      ? `${match.participant1.firstName} ${match.participant1.lastName}`
      : null
  );
  let p2Name = $derived(
    match.participant2
      ? `${match.participant2.firstName} ${match.participant2.lastName}`
      : null
  );

  // Winner states
  let isWinner1 = $derived(
    match.winnerId && match.participant1Id === match.winnerId
  );
  let isWinner2 = $derived(
    match.winnerId && match.participant2Id === match.winnerId
  );

  // Format scores (e.g., [21, 19, 21] -> "21-19-21")
  function formatScore(scores?: number[]): string {
    if (!scores || scores.length === 0) return '';
    return scores.join('-');
  }

  let score1 = $derived(formatScore(match.scoreParticipant1));
  let score2 = $derived(formatScore(match.scoreParticipant2));

  // Status-based styling
  let isPending = $derived(
    match.status === 'pending' && (!match.participant1Id || !match.participant2Id)
  );
  let isLive = $derived(match.status === 'in_progress');
  let isFinished = $derived(match.status === 'finished');
  let isWalkover = $derived(match.status === 'walkover');

  // Clickable state
  let isClickable = $derived(
    isOrganizer &&
    match.participant1Id &&
    match.participant2Id &&
    match.status !== 'walkover'
  );
</script>

<div
  class={cn(
    'w-[200px] bg-white rounded-lg shadow-sm border-2 transition-all duration-200',
    // Status-based borders
    isPending && 'border-dashed border-gray-300',
    isLive && 'border-red-500',
    isFinished && 'border-green-400',
    isWalkover && 'border-amber-400',
    !isPending && !isLive && !isFinished && !isWalkover && 'border-gray-200',
    // Highlighting for path tracing
    isHighlighted && 'ring-2 ring-emerald-500 ring-offset-2 shadow-lg',
    isDimmed && 'opacity-40',
    // Selection state
    selected && !isHighlighted && 'ring-2 ring-blue-500',
    // Clickable state
    isClickable && 'cursor-pointer hover:shadow-md hover:border-emerald-400'
  )}
>
  <!-- Left handles (targets) -->
  <Handle
    type="target"
    position={Position.Left}
    id="target-left-top"
    class="!bg-gray-400 !w-2 !h-2 !border-none"
    style="top: 25%;"
  />
  <Handle
    type="target"
    position={Position.Left}
    id="target-left-bottom"
    class="!bg-gray-400 !w-2 !h-2 !border-none"
    style="top: 75%;"
  />

  <!-- Right handle (source) -->
  <Handle
    type="source"
    position={Position.Right}
    id="source-right"
    class="!bg-gray-400 !w-2 !h-2 !border-none"
    style="top: 50%;"
  />

  <!-- Player 1 -->
  <div
    class={cn(
      'flex items-center justify-between px-3 py-2 border-b border-gray-100',
      isWinner1 && 'bg-green-50'
    )}
  >
    <span
      class={cn(
        'text-sm truncate flex-1 text-left',
        isWinner1 && 'font-bold text-green-700',
        !isWinner1 && isWinner2 && 'opacity-50'
      )}
    >
      {#if p1Name}
        {p1Name}
      {:else if isWalkover && !match.participant1Id}
        <span class="text-gray-400 italic">BYE</span>
      {:else}
        <span class="text-gray-400">A determiner</span>
      {/if}
    </span>
    {#if score1}
      <span class="text-sm font-bold ml-2 tabular-nums">{score1}</span>
    {/if}
  </div>

  <!-- Player 2 -->
  <div
    class={cn(
      'flex items-center justify-between px-3 py-2',
      isWinner2 && 'bg-green-50'
    )}
  >
    <span
      class={cn(
        'text-sm truncate flex-1 text-left',
        isWinner2 && 'font-bold text-green-700',
        !isWinner2 && isWinner1 && 'opacity-50'
      )}
    >
      {#if p2Name}
        {p2Name}
      {:else if isWalkover && !match.participant2Id}
        <span class="text-gray-400 italic">BYE</span>
      {:else}
        <span class="text-gray-400">A determiner</span>
      {/if}
    </span>
    {#if score2}
      <span class="text-sm font-bold ml-2 tabular-nums">{score2}</span>
    {/if}
  </div>

  <!-- Live indicator - pulsing red dot -->
  {#if isLive}
    <div class="absolute -top-1 -right-1 flex items-center gap-1">
      <span class="relative flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
    </div>
  {/if}
</div>
