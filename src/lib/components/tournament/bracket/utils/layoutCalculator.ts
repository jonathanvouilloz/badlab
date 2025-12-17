import type {
  BracketMatch,
  BracketData,
  MatchNode,
  RoundLabelNode,
  BracketEdge,
  BracketLayoutConfig
} from '../types';
import type { Node } from '@xyflow/svelte';

const DEFAULT_CONFIG: BracketLayoutConfig = {
  nodeWidth: 220,
  nodeHeight: 80,
  columnGap: 180,
  initialVerticalGap: 24
};

/**
 * Calculate round name based on position from final
 */
export function getRoundName(
  roundIndex: number,
  totalRounds: number,
  matchCount: number
): string {
  const fromFinal = totalRounds - roundIndex - 1;

  if (fromFinal === 0) return 'Finale';
  if (fromFinal === 1) return 'Demi-finales';
  if (fromFinal === 2) return 'Quarts de finale';
  if (matchCount === 8) return 'Huitiemes de finale';
  if (matchCount === 16) return 'Seiziemes de finale';

  return `Tour ${roundIndex + 1}`;
}

/**
 * Convert bracket data to Svelte Flow nodes and edges
 */
export function calculateBracketLayout(
  rounds: BracketMatch[][],
  isOrganizer: boolean,
  config: Partial<BracketLayoutConfig> = {}
): { nodes: Node[]; edges: BracketEdge[]; labelNodes: RoundLabelNode[] } {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const totalRounds = rounds.length;
  const nodes: MatchNode[] = [];
  const labelNodes: RoundLabelNode[] = [];
  const edges: BracketEdge[] = [];

  if (totalRounds === 0) {
    return { nodes, edges, labelNodes };
  }

  // Calculate the total height based on first round
  const firstRoundMatchCount = rounds[0]?.length || 0;
  const totalCanvasHeight =
    firstRoundMatchCount * cfg.nodeHeight +
    (firstRoundMatchCount - 1) * cfg.initialVerticalGap;

  // Calculate startY for the first round (we need this for label positioning)
  const firstRoundStartY = 0;

  // Create nodes for each round
  for (let roundIdx = 0; roundIdx < totalRounds; roundIdx++) {
    const round = rounds[roundIdx];
    const matchCount = round.length;
    const x = roundIdx * (cfg.nodeWidth + cfg.columnGap);

    // Calculate vertical gap - doubles each round
    const verticalGap = cfg.initialVerticalGap * Math.pow(2, roundIdx + 1) - cfg.initialVerticalGap;

    // Calculate total height for this round
    const roundHeight = matchCount * cfg.nodeHeight + (matchCount - 1) * verticalGap;

    // Center this round vertically
    const startY = (totalCanvasHeight - roundHeight) / 2;

    const roundName = getRoundName(roundIdx, totalRounds, matchCount);

    // Create label node for this round (positioned above first match)
    labelNodes.push({
      id: `label-${roundIdx}`,
      type: 'roundLabel',
      position: { x, y: startY - 50 },
      data: {
        name: roundName,
        matchCount
      },
      draggable: false,
      selectable: false
    });

    for (let matchIdx = 0; matchIdx < matchCount; matchIdx++) {
      const match = round[matchIdx];
      const y = startY + matchIdx * (cfg.nodeHeight + verticalGap);

      nodes.push({
        id: match._id,
        type: 'match',
        position: { x, y },
        data: {
          match,
          roundIndex: roundIdx,
          roundName,
          isOrganizer,
          isHighlighted: false,
          isDimmed: false
        },
        draggable: false,
        selectable: true
      });
    }
  }

  // Create edges connecting matches between rounds
  for (let roundIdx = 1; roundIdx < totalRounds; roundIdx++) {
    const currentRound = rounds[roundIdx];
    const prevRound = rounds[roundIdx - 1];

    for (let matchIdx = 0; matchIdx < currentRound.length; matchIdx++) {
      const targetMatch = currentRound[matchIdx];

      // Each match in current round gets winners from 2 matches in previous round
      const sourceIdx1 = matchIdx * 2;
      const sourceIdx2 = matchIdx * 2 + 1;

      // Edge from first source match
      if (prevRound[sourceIdx1]) {
        edges.push({
          id: `e-${prevRound[sourceIdx1]._id}-${targetMatch._id}-top`,
          source: prevRound[sourceIdx1]._id,
          target: targetMatch._id,
          sourceHandle: 'source-right',
          targetHandle: 'target-left-top',
          type: 'smoothstep',
          animated: false,
          style: 'stroke: #94a3b8; stroke-width: 2px;',
          data: {
            matchId: targetMatch._id,
            isHighlighted: false
          }
        });
      }

      // Edge from second source match
      if (prevRound[sourceIdx2]) {
        edges.push({
          id: `e-${prevRound[sourceIdx2]._id}-${targetMatch._id}-bottom`,
          source: prevRound[sourceIdx2]._id,
          target: targetMatch._id,
          sourceHandle: 'source-right',
          targetHandle: 'target-left-bottom',
          type: 'smoothstep',
          animated: false,
          style: 'stroke: #94a3b8; stroke-width: 2px;',
          data: {
            matchId: targetMatch._id,
            isHighlighted: false
          }
        });
      }
    }
  }

  // Combine match nodes and label nodes
  const allNodes: Node[] = [...labelNodes, ...nodes];

  return { nodes: allNodes, edges, labelNodes };
}

/**
 * Get ancestor and descendant match IDs for path highlighting
 */
export function getMatchPath(
  matchId: string,
  rounds: BracketMatch[][]
): { ancestors: Set<string>; descendants: Set<string> } {
  const ancestors = new Set<string>();
  const descendants = new Set<string>();

  // Find the match position
  let targetRound = -1;
  let targetIdx = -1;

  for (let r = 0; r < rounds.length; r++) {
    const idx = rounds[r].findIndex((m) => m._id === matchId);
    if (idx !== -1) {
      targetRound = r;
      targetIdx = idx;
      break;
    }
  }

  if (targetRound === -1) return { ancestors, descendants };

  // Trace ancestors (matches in previous rounds that feed into this one)
  function traceAncestors(roundIdx: number, matchIdx: number) {
    if (roundIdx <= 0) return;

    const prevRound = rounds[roundIdx - 1];
    const sourceIdx1 = matchIdx * 2;
    const sourceIdx2 = matchIdx * 2 + 1;

    if (prevRound[sourceIdx1]) {
      ancestors.add(prevRound[sourceIdx1]._id);
      traceAncestors(roundIdx - 1, sourceIdx1);
    }

    if (prevRound[sourceIdx2]) {
      ancestors.add(prevRound[sourceIdx2]._id);
      traceAncestors(roundIdx - 1, sourceIdx2);
    }
  }

  // Trace descendants (matches in next rounds that this one feeds into)
  function traceDescendants(roundIdx: number, matchIdx: number) {
    if (roundIdx >= rounds.length - 1) return;

    const nextRound = rounds[roundIdx + 1];
    const nextMatchIdx = Math.floor(matchIdx / 2);

    if (nextRound[nextMatchIdx]) {
      descendants.add(nextRound[nextMatchIdx]._id);
      traceDescendants(roundIdx + 1, nextMatchIdx);
    }
  }

  traceAncestors(targetRound, targetIdx);
  traceDescendants(targetRound, targetIdx);

  return { ancestors, descendants };
}

/**
 * Get edge IDs that are part of the highlight path
 */
export function getPathEdges(
  matchId: string,
  rounds: BracketMatch[][],
  edges: BracketEdge[]
): Set<string> {
  const { ancestors, descendants } = getMatchPath(matchId, rounds);
  const pathNodes = new Set([matchId, ...ancestors, ...descendants]);
  const pathEdges = new Set<string>();

  for (const edge of edges) {
    if (pathNodes.has(edge.source) && pathNodes.has(edge.target)) {
      pathEdges.add(edge.id);
    }
  }

  return pathEdges;
}
