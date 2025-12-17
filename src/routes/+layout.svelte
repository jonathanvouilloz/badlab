<script lang="ts">
  import '../app.css';
  import { Header, Footer } from '$lib/components/layout';
  import { ToastContainer } from '$lib/components/ui';
  import { setupConvex } from 'convex-svelte';
  import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
  import { authClient } from '$lib/auth-client';
  import { PUBLIC_CONVEX_URL } from '$env/static/public';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  // Initialize Convex client
  setupConvex(PUBLIC_CONVEX_URL);

  // Initialize Auth Client
  createSvelteAuthClient({ authClient });
</script>

<svelte:head>
  <title>BadLab - Le labo des tournois de bad</title>
  <meta name="description" content="Outil web gratuit, simple et moderne pour gerer vos tournois de badminton internes de clubs." />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Header />

  <main class="flex-1">
    {@render children()}
  </main>

  <Footer />
</div>

<ToastContainer />
