export type ParticipantLevel = 'beginner' | 'intermediate' | 'advanced' | 'competition';

export interface Participant {
  id: string;
  tournament_id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  club?: string;
  elo_rating?: number;
  level?: ParticipantLevel;
  seed?: number;
  pool_id?: string;
  created_at: string;
}

export interface CreateParticipantInput {
  tournament_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  club?: string;
  elo_rating?: number;
  level?: ParticipantLevel;
}

export interface Team {
  id: string;
  tournament_id: string;
  player1_id: string;
  player2_id: string;
  team_name?: string;
  seed?: number;
  pool_id?: string;
  created_at: string;
}
