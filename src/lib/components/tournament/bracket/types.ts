import type { Id, Doc } from '$convex/_generated/dataModel';
import type { Node, Edge } from '@xyflow/svelte';

export interface BracketParticipant {
  _id: Id<'participants'>;
  firstName: string;
  lastName: string;
  email?: string;
  level?: string;
}

export interface BracketTeam {
  _id: Id<'teams'>;
  player1Id: Id<'participants'>;
  player2Id: Id<'participants'>;
  teamName?: string;
  seed?: number;
}

export interface BracketMatch {
  _id: Id<'matches'>;
  tournamentId: Id<'tournaments'>;
  round: number;
  matchNumber: number;
  phase?: 'pool' | 'elimination' | 'final';
  // Participants (pour matchs individuels)
  participant1Id?: Id<'participants'>;
  participant2Id?: Id<'participants'>;
  participant1?: BracketParticipant;
  participant2?: BracketParticipant;
  // Teams (pour matchs d'equipes)
  team1Id?: Id<'teams'>;
  team2Id?: Id<'teams'>;
  team1?: BracketTeam;
  team2?: BracketTeam;
  team1Player1?: BracketParticipant | null;
  team1Player2?: BracketParticipant | null;
  team2Player1?: BracketParticipant | null;
  team2Player2?: BracketParticipant | null;
  // Noms d'affichage calcules par le backend
  participant1DisplayName?: string;
  participant2DisplayName?: string;
  // Scores et statut
  scoreParticipant1?: number[];
  scoreParticipant2?: number[];
  winnerId?: string;
  status: 'pending' | 'in_progress' | 'finished' | 'walkover' | 'disqualified';
  validated: boolean;
}

export interface BracketData {
  rounds: BracketMatch[][];
  totalRounds: number;
  participantCount: number;
  isTeamTournament?: boolean;
  teamCount?: number;
}

export type MatchStatus = BracketMatch['status'];

// ========================================
// Svelte Flow Types for Bracket Canvas
// ========================================

/** Data stored in each match node for Svelte Flow */
export interface MatchNodeData {
  match: BracketMatch;
  roundIndex: number;
  roundName: string;
  isOrganizer: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
}

/** Custom match node type for Svelte Flow */
export type MatchNode = Node<MatchNodeData, 'match'>;

/** Data stored in round label nodes */
export interface RoundLabelNodeData {
  name: string;
  matchCount: number;
}

/** Custom round label node type for Svelte Flow */
export type RoundLabelNode = Node<RoundLabelNodeData, 'roundLabel'>;

/** Edge data for bracket connections */
export interface BracketEdgeData {
  matchId: string;
  isHighlighted: boolean;
}

/** Custom edge type for Svelte Flow */
export type BracketEdge = Edge<BracketEdgeData>;

/** Layout configuration for bracket canvas */
export interface BracketLayoutConfig {
  nodeWidth: number;
  nodeHeight: number;
  columnGap: number;
  initialVerticalGap: number;
}

/** Drawer state for match details */
export interface MatchDrawerState {
  isOpen: boolean;
  match: BracketMatch | null;
}
