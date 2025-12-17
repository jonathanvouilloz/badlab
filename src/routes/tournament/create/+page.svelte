<script lang="ts">
  import { useQuery } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';
  import { Trophy, ShieldAlert } from 'lucide-svelte';
  import StepIndicator from '$lib/components/tournament/StepIndicator.svelte';
  import { createWizardContext } from '$lib/components/tournament/wizard/WizardContext.svelte';
  import Step1BasicInfo from '$lib/components/tournament/wizard/Step1BasicInfo.svelte';
  import Step2Participants from '$lib/components/tournament/wizard/Step2Participants.svelte';
  import Step3Configuration from '$lib/components/tournament/wizard/Step3Configuration.svelte';
  import Step4Summary from '$lib/components/tournament/wizard/Step4Summary.svelte';

  // Auth state
  const session = authClient.useSession();

  // User queries
  const appUserQuery = useQuery(api.users.getCurrentAppUser, {});

  // Derived states
  let isAuthenticated = $derived(!!$session.data);
  let authLoading = $derived($session.isPending);
  let appUser = $derived(appUserQuery.data);
  let isOrganizer = $derived(appUser?.role === 'organizer');
  let loading = $derived(authLoading || appUserQuery.isLoading);

  // Redirect if not authenticated
  $effect(() => {
    if (!authLoading && !isAuthenticated) {
      goto('/auth/login?redirectTo=/tournament/create');
    }
  });

  // Create wizard context
  const wizard = createWizardContext();
</script>

<svelte:head>
  <title>Creer un tournoi - BadLab</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  {#if loading}
    <div class="bg-white border border-border rounded-xl shadow-md">
      <div class="flex flex-col items-center justify-center text-center p-12">
        <span class="loading loading-spinner loading-lg text-accent"></span>
        <p class="text-small text-text-secondary mt-4">Chargement...</p>
      </div>
    </div>
  {:else if !isAuthenticated}
    <div class="bg-white border border-border rounded-xl shadow-md">
      <div class="flex flex-col items-center justify-center text-center p-12">
        <p class="text-small text-text-secondary">Redirection vers la connexion...</p>
      </div>
    </div>
  {:else if !isOrganizer}
    <!-- Acces refuse - pas organisateur -->
    <div role="alert" class="bg-danger/10 border border-danger/20 rounded-xl p-6">
      <div class="flex items-start gap-4">
        <ShieldAlert class="size-8 text-danger shrink-0" />
        <div class="flex-1">
          <h3 class="heading-3 text-text-primary mb-2">Acces reserve aux organisateurs</h3>
          <p class="text-small text-text-secondary">
            Vous devez avoir le role d'organisateur pour creer un tournoi. Contactez un administrateur
            pour obtenir ce role.
          </p>
        </div>
        <div class="shrink-0">
          <a
            href="/dashboard"
            class="inline-flex items-center justify-center gap-2 bg-white hover:bg-bg-secondary text-text-primary text-button px-4 py-2 border border-border rounded-lg transition-colors duration-200"
          >
            Retour au tableau de bord
          </a>
        </div>
      </div>
    </div>
  {:else}
    <!-- Wizard de creation -->
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <div class="size-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Trophy class="size-6 text-accent" />
        </div>
        <div>
          <h1 class="heading-1 text-text-primary">Creer un tournoi</h1>
          <p class="text-body text-text-secondary">Configurez votre tournoi en quelques etapes simples.</p>
        </div>
      </div>

      <!-- Step Indicator -->
      <StepIndicator currentStep={wizard.currentStep} />

      <!-- Step Content -->
      <div class="bg-white border border-border rounded-xl shadow-md">
        <div class="p-6 md:p-8">
          {#if wizard.currentStep === 1}
            <Step1BasicInfo />
          {:else if wizard.currentStep === 2}
            <Step2Participants />
          {:else if wizard.currentStep === 3}
            <Step3Configuration />
          {:else if wizard.currentStep === 4}
            <Step4Summary />
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
