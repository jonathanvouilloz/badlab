import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  // La vérification de l'authentification et du rôle se fait côté client
  return {};
};
