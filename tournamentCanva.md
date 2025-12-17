# Plan: Tournament Bracket UX/UI Enhancement

## Overview
Implement an interactive tournament bracket visualization using **Svelte Flow** (@xyflow/svelte v1.5.0) with desktop "infinite canvas" and mobile "swipeable columns" views.

## Tech Stack
- **Canvas**: Svelte Flow (already installed)
- **Animations**: Svelte native transitions (fly, slide, fade)
- **Approach**: Incremental (Desktop → Mobile → Interactivity)

---

## Phase 1: Desktop Canvas (Svelte Flow)

### 1.1 Extend Types
**File**: `src/lib/components/tournament/bracket/types.ts`

Add Svelte Flow node/edge types:
```typescript
import type { Node, Edge } from '@xyflow/svelte';

export interface MatchNodeData {
  match: BracketMatch;
  roundIndex: number;
  roundName: string;
  isOrganizer: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
}

export type MatchNode = Node<MatchNodeData, 'match'>;
export type BracketEdge = Edge<{ matchId: string; isHighlighted: boolean }>;
```

### 1.2 Create Layout Calculator
**File**: `src/lib/components/tournament/bracket/utils/layoutCalculator.ts` (NEW)

- `calculateBracketLayout(rounds, isOrganizer)` → `{ nodes: MatchNode[], edges: BracketEdge[] }`
- `getRoundName(roundIndex, totalRounds, matchCount)` → "Quarts", "Demi-finales", "Finale"
- `getMatchPath(matchId, rounds)` → `{ ancestors: string[], descendants: string[] }` for highlighting

**Layout Algorithm**:
- X = roundIndex × (nodeWidth + columnGap) = roundIndex × 420px
- Y = Centered based on match count with exponential gap per round

### 1.3 Create MatchNode Component
**File**: `src/lib/components/tournament/bracket/MatchNode.svelte` (NEW)

Custom Svelte Flow node:
- Header: Player 1 (name + score)
- Footer: Player 2 (name + score)
- Visual states via `cn()`:
  - Pending: `border-dashed border-gray-300`
  - Live: `border-red-500 border-2` + pulsing dot
  - Finished: `border-success/50`, winner row `bg-success/10`
  - Walkover: `border-warning/50`
- Handles: left (target, top/bottom), right (source)
- Highlighting: `ring-2 ring-accent` when highlighted, `opacity-40` when dimmed

### 1.4 Create BracketCanvas Component
**File**: `src/lib/components/tournament/bracket/BracketCanvas.svelte` (NEW)

```svelte
<SvelteFlow {nodes} {edges} {nodeTypes} fitView>
  <Controls position="bottom-left" />
  <MiniMap position="bottom-right" pannable zoomable />
  <Background variant={BackgroundVariant.Dots} />
  <Panel position="top-left"><!-- Round Headers --></Panel>
</SvelteFlow>
```

Features:
- Pan & Zoom enabled
- `on:nodeclick` → open ScoreModal (organizer) or Drawer (viewer)
- `on:nodemouseenter/leave` → path highlighting

### 1.5 Create MatchDrawer Component
**File**: `src/lib/components/tournament/bracket/MatchDrawer.svelte` (NEW)

Side drawer with `fly` transition:
- Match status badge
- Player cards with winner highlighting
- Score breakdown by set
- Placeholder for future chat

---

## Phase 2: Mobile View

### 2.1 Create Media Query Hook
**File**: `src/lib/components/tournament/bracket/utils/useMediaQuery.svelte.ts` (NEW)

```typescript
export function useMediaQuery(query: string): { readonly current: boolean }
```

### 2.2 Create MobileBracket Component
**File**: `src/lib/components/tournament/bracket/MobileBracket.svelte` (NEW)

- **Swipeable columns**: One round per slide with touch gestures
- **Round header**: Prev/Next arrows + round name + progress (2/4)
- **Edge indicators**: Gradient arrows showing more content
- **FAB toggle**: Switch between bracket view and chronological list view
- Reuse existing `BracketMatch.svelte` for cards

---

## Phase 3: Interactivity ("Wow Effects")

### 3.1 Path Highlighting
Already integrated in BracketCanvas:
- `updateHighlighting(nodeId)` → apply `isHighlighted`/`isDimmed` to nodes
- Edges: `animated: true` + accent stroke for path
- Others: `opacity: 0.3`

### 3.2 Update Main Bracket Component
**File**: `src/lib/components/tournament/bracket/Bracket.svelte` (MODIFY)

```svelte
{#if isMobile.current}
  <MobileBracket {bracket} {isOrganizer} {onMatchClick} />
{:else}
  <BracketCanvas {bracket} {isOrganizer} {onMatchClick} />
{/if}
```

---

## File Structure Summary

```
src/lib/components/tournament/bracket/
├── types.ts                    # MODIFY: Add Svelte Flow types
├── Bracket.svelte              # MODIFY: Add responsive switch
├── BracketCanvas.svelte        # NEW: Desktop Svelte Flow canvas
├── MatchNode.svelte            # NEW: Custom flow node
├── MatchDrawer.svelte          # NEW: Side drawer
├── MobileBracket.svelte        # NEW: Mobile swipeable view
├── BracketMatch.svelte         # KEEP: Reuse for mobile
├── BracketRound.svelte         # KEEP: Fallback reference
├── ScoreModal.svelte           # KEEP: Score editing
├── index.ts                    # MODIFY: Export new components
└── utils/
    ├── layoutCalculator.ts     # NEW: Layout algorithm
    └── useMediaQuery.svelte.ts # NEW: Media query hook
```

---

## Implementation Order

1. **types.ts** - Add Svelte Flow node/edge types
2. **utils/layoutCalculator.ts** - Create layout calculation utility
3. **utils/useMediaQuery.svelte.ts** - Create media query hook
4. **MatchNode.svelte** - Custom Svelte Flow node
5. **BracketCanvas.svelte** - Desktop canvas with Svelte Flow
6. **MatchDrawer.svelte** - Side drawer component
7. **Bracket.svelte** - Update with responsive logic
8. **MobileBracket.svelte** - Mobile swipeable view
9. **index.ts** - Update exports

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Library | Svelte Flow | Native Svelte, same team as React Flow |
| Animations | Svelte transitions | Lightweight, no extra deps |
| Mobile detection | Custom hook | Svelte 5 runes, reactive |
| Node styling | Tailwind + cn() | Match existing patterns |
| Score editing | Keep ScoreModal | Already works, badminton rules |

---

## Edge Cases Handled

- **BYEs**: Display "BYE" in italic, auto-walkover
- **Odd participants**: Backend calculates power-of-2 bracket
- **Real-time updates**: Convex reactive queries + $effect
- **Large brackets**: Svelte Flow virtualization + MiniMap
