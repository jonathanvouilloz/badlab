export type TournamentStatus = 'draft' | 'registration_open' | 'in_progress' | 'finished';
export type TournamentFormat = 'elimination' | 'pools_elimination' | 'round_robin' | 'swiss';
export type TournamentType = 'single' | 'double' | 'mixed';
export type InscriptionType = 'closed' | 'open';

export interface Tournament {
  id: string;
  organizer_id: string;
  name: string;
  description?: string;
  location?: string;
  banner_url?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  format: TournamentFormat;
  tournament_type: TournamentType;
  inscription_type: InscriptionType;
  inscription_deadline?: string;
  max_participants?: number;
  nb_courts?: number;
  match_duration?: number;
  status: TournamentStatus;
  settings: TournamentSettings;
  created_at: string;
  updated_at: string;
}

export interface TournamentSettings {
  nb_pools?: number;
  players_per_pool?: number;
  qualified_per_pool?: number;
  seeding_method?: 'auto' | 'manual' | 'random';
}

export interface CreateTournamentInput {
  name: string;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  format: TournamentFormat;
  tournament_type: TournamentType;
  inscription_type: InscriptionType;
  inscription_deadline?: string;
  max_participants?: number;
  nb_courts?: number;
  match_duration?: number;
  settings?: TournamentSettings;
}
