// Helpers for role-based permissions
// Ces fonctions utilisent les queries Convex pour vérifier les rôles

// Note: Ces fonctions sont destinées à être utilisées avec le client Convex
// Exemple d'utilisation dans un composant Svelte:
//
// import { useConvex } from 'convex-svelte';
// import { api } from '$convex/_generated/api';
//
// const convex = useConvex();
// const appUser = $derived(useQuery(api.users.getCurrentAppUser));
// const isOrg = $derived(useQuery(api.users.isOrganizer));

export type Role = 'organizer' | 'player';

export interface AppUser {
  _id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role: Role;
  authId?: string;
}

/**
 * Vérifie si l'utilisateur peut créer des tournois
 */
export function canCreateTournament(role: Role | null): boolean {
  return role === 'organizer';
}

/**
 * Vérifie si l'utilisateur peut gérer un tournoi
 */
export function canManageTournament(role: Role | null): boolean {
  return role === 'organizer';
}

/**
 * Vérifie si l'utilisateur peut saisir des scores
 * Les deux rôles peuvent saisir des scores
 */
export function canEnterScore(role: Role | null): boolean {
  return role === 'organizer' || role === 'player';
}

/**
 * Vérifie si l'utilisateur peut s'inscrire aux tournois
 * Les deux rôles peuvent s'inscrire
 */
export function canRegister(role: Role | null): boolean {
  return role === 'organizer' || role === 'player';
}

/**
 * Retourne les permissions pour un rôle donné
 */
export function getPermissions(role: Role | null) {
  return {
    canCreateTournament: canCreateTournament(role),
    canManageTournament: canManageTournament(role),
    canEnterScore: canEnterScore(role),
    canRegister: canRegister(role),
  };
}
