export type MatchStatus = 'pending' | 'in_progress' | 'finished' | 'walkover' | 'disqualified';
export type MatchPhase = 'pool' | 'elimination' | 'final';

export interface Match {
  id: string;
  tournament_id: string;
  round: number;
  match_number: number;
  phase?: MatchPhase;
  pool_id?: string;
  court?: number;
  scheduled_time?: string;
  participant1_id?: string;
  participant2_id?: string;
  team1_id?: string;
  team2_id?: string;
  score_participant1?: number[];
  score_participant2?: number[];
  winner_id?: string;
  status: MatchStatus;
  entered_by?: string;
  validated: boolean;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface Pool {
  id: string;
  tournament_id: string;
  pool_name: string;
  pool_number: number;
  created_at: string;
}

export interface PoolStanding {
  id: string;
  pool_id: string;
  participant_id?: string;
  team_id?: string;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  sets_won: number;
  sets_lost: number;
  points_scored: number;
  points_conceded: number;
  position?: number;
  updated_at: string;
}

export interface ScoreInput {
  set1: [number, number];
  set2?: [number, number];
  set3?: [number, number];
}
