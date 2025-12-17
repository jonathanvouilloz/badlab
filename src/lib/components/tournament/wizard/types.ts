// Types pour le wizard de création de tournoi

export type WizardStep = 1 | 2 | 3 | 4;

export type TournamentType = 'single' | 'double' | 'mixed';

export type ParticipantLevel = 'beginner' | 'intermediate' | 'advanced' | 'competition';

export type Gender = 'M' | 'F';

export type SeedingMethod = 'random' | 'manual';

export interface WizardParticipant {
  id: string; // UUID temporaire côté client
  firstName: string;
  lastName: string;
  email?: string;
  level?: ParticipantLevel;
  gender?: Gender; // Requis pour tournois mixtes
}

export interface WizardFormData {
  // Step 1 - Infos de base
  name: string;
  startDate: string;
  startTime: string;
  location: string;
  description: string;
  tournamentType: TournamentType;

  // Step 2 - Participants
  participants: WizardParticipant[];

  // Step 3 - Configuration
  seedingMethod: SeedingMethod;
  participantOrder: string[]; // IDs dans l'ordre si seeding manuel
}

export const defaultFormData: WizardFormData = {
  name: '',
  startDate: '',
  startTime: '',
  location: '',
  description: '',
  tournamentType: 'single',
  participants: [],
  seedingMethod: 'random',
  participantOrder: [],
};
