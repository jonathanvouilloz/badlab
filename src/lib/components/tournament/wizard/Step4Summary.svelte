<script lang="ts">
  import { goto } from '$app/navigation';
  import { getWizardContext } from './WizardContext.svelte';
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { getFunctionName } from 'convex/server';
  import {
    ArrowLeft,
    Check,
    Trophy,
    Calendar,
    Clock,
    MapPin,
    Users,
    Shuffle,
    ListOrdered,
    AlertCircle
  } from 'lucide-svelte';

  const wizard = getWizardContext();

  // Convex client for mutations
  const convexClient = useConvexClient();

  // Get current user
  const currentUserQuery = useQuery(api.users.getCurrentAppUser, {});
  let currentUser = $derived(currentUserQuery.data);

  // Format helpers
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function getTournamentTypeLabel(type: string): string {
    switch (type) {
      case 'single':
        return 'Simple';
      case 'double':
        return 'Double';
      case 'mixed':
        return 'Mixte';
      default:
        return type;
    }
  }

  function getSeedingLabel(method: string): string {
    return method === 'manual' ? 'Seeding manuel' : 'Aleatoire';
  }

  // Valid participants (with name)
  let validParticipants = $derived(
    wizard.formData.participants.filter((p) => p.firstName.trim() && p.lastName.trim())
  );

  // Navigation
  function handlePrev() {
    wizard.prevStep();
  }

  // Submit
  async function handleSubmit() {
    if (!currentUser) {
      wizard.setError('submit', 'Utilisateur non connecte');
      return;
    }

    wizard.isSubmitting = true;
    wizard.clearError('submit');

    try {
      // 1. Creer le tournoi
      const tournamentId = await convexClient.mutation(getFunctionName(api.tournaments.create), {
        organizerId: currentUser._id,
        name: wizard.formData.name,
        startDate: wizard.formData.startDate,
        startTime: wizard.formData.startTime || undefined,
        location: wizard.formData.location || undefined,
        description: wizard.formData.description || undefined,
        format: 'elimination', // MVP: elimination directe uniquement
        tournamentType: wizard.formData.tournamentType,
        inscriptionType: 'closed', // MVP: liste manuelle uniquement
        settings: {
          seedingMethod: wizard.formData.seedingMethod
        }
      });

      // 2. Ajouter les participants
      const participantsData = validParticipants.map((p) => ({
        firstName: p.firstName.trim(),
        lastName: p.lastName.trim(),
        email: p.email || undefined,
        level: p.level || undefined,
        gender: p.gender || undefined
      }));

      await convexClient.mutation(getFunctionName(api.participants.bulkCreate), {
        tournamentId,
        participants: participantsData
      });

      // 3. Rediriger vers le tournoi cree
      goto(`/tournament/${tournamentId}`);
    } catch (error) {
      console.error('Erreur creation tournoi:', error);
      wizard.setError(
        'submit',
        'Une erreur est survenue lors de la creation du tournoi. Veuillez reessayer.'
      );
    } finally {
      wizard.isSubmitting = false;
    }
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="heading-2 text-text-primary mb-2">Recapitulatif</h2>
    <p class="text-small text-text-secondary">
      Verifiez les informations avant de creer le tournoi.
    </p>
  </div>

  <!-- Summary sections -->
  <div class="space-y-4">
    <!-- Tournament info -->
    <div class="bg-white border border-border rounded-xl p-4">
      <div class="flex items-center gap-3 mb-4">
        <div class="size-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <Trophy class="size-5 text-accent" />
        </div>
        <div>
          <h3 class="heading-3 text-text-primary">{wizard.formData.name}</h3>
          <span class="inline-flex items-center gap-1.5 bg-info/10 text-info border border-info/20 text-xs font-semibold px-2 py-1 rounded-md mt-1">
            {getTournamentTypeLabel(wizard.formData.tournamentType)}
          </span>
        </div>
      </div>

      <div class="h-px bg-border my-4"></div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="flex items-center gap-2 text-small text-text-secondary">
          <Calendar class="size-4" />
          <span>{formatDate(wizard.formData.startDate)}</span>
        </div>
        {#if wizard.formData.startTime}
          <div class="flex items-center gap-2 text-small text-text-secondary">
            <Clock class="size-4" />
            <span>{wizard.formData.startTime}</span>
          </div>
        {/if}
        {#if wizard.formData.location}
          <div class="flex items-center gap-2 text-small text-text-secondary">
            <MapPin class="size-4" />
            <span>{wizard.formData.location}</span>
          </div>
        {/if}
      </div>

      {#if wizard.formData.description}
        <div class="h-px bg-border my-4"></div>
        <p class="text-small text-text-secondary">
          {wizard.formData.description}
        </p>
      {/if}
    </div>

    <!-- Participants -->
    <div class="bg-white border border-border rounded-xl p-4">
      <div class="flex items-center gap-3 mb-4">
        <div class="size-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
          <Users class="size-5 text-info" />
        </div>
        <div>
          <h3 class="heading-3 text-text-primary">{validParticipants.length} participants</h3>
          <p class="text-small text-text-secondary">Tournoi a elimination directe</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        {#each validParticipants as participant}
          <span class="inline-block bg-bg-tertiary text-text-secondary border border-border text-xs font-medium px-3 py-1.5 rounded-md">
            {participant.firstName}
            {participant.lastName}
          </span>
        {/each}
      </div>
    </div>

    <!-- Seeding method -->
    <div class="bg-white border border-border rounded-xl p-4">
      <div class="flex items-center gap-3">
        <div class="size-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
          {#if wizard.formData.seedingMethod === 'manual'}
            <ListOrdered class="size-5 text-info" />
          {:else}
            <Shuffle class="size-5 text-info" />
          {/if}
        </div>
        <div>
          <h3 class="heading-3 text-text-primary">
            Placement {getSeedingLabel(wizard.formData.seedingMethod)}
          </h3>
          <p class="text-small text-text-secondary">
            {#if wizard.formData.seedingMethod === 'manual'}
              Les joueurs seront places selon l'ordre defini
            {:else}
              Les joueurs seront melanges aleatoirement
            {/if}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Error message -->
  {#if wizard.getError('submit')}
    <div role="alert" class="bg-danger/10 border border-danger/20 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <AlertCircle class="size-5 text-danger shrink-0" />
        <p class="text-small text-text-primary">{wizard.getError('submit')}</p>
      </div>
    </div>
  {/if}

  <!-- Navigation -->
  <div class="flex justify-between pt-4 border-t border-border">
    <button
      class="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-bg-secondary text-text-primary text-button px-4 py-2 rounded-lg transition-colors duration-200"
      onclick={handlePrev}
      disabled={wizard.isSubmitting}
    >
      <ArrowLeft class="size-5" />
      Precedent
    </button>
    <button
      class="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white text-button px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      onclick={handleSubmit}
      disabled={wizard.isSubmitting}
    >
      {#if wizard.isSubmitting}
        <span class="loading loading-spinner"></span>
        Creation en cours...
      {:else}
        <Check class="size-5" />
        Creer le tournoi
      {/if}
    </button>
  </div>
</div>
