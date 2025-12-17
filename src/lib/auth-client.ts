import { createAuthClient } from 'better-auth/svelte';
import { PUBLIC_SITE_URL } from '$env/static/public';

export const authClient = createAuthClient({
  baseURL: PUBLIC_SITE_URL,
});
