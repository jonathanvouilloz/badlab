<script lang="ts">
  import { getWizardContext } from './WizardContext.svelte';
  import { ArrowLeft, ArrowRight, Plus, Users, AlertCircle } from 'lucide-svelte';
  import ParticipantRow from './ParticipantRow.svelte';
  import type { WizardParticipant } from './types';

  const wizard = getWizardContext();

  // Local state synced with wizard
  let participants = $state<WizardParticipant[]>([...wizard.formData.participants]);

  // Determiner si on doit afficher le selecteur de genre
  const showGender = $derived(wizard.formData.tournamentType !== 'single');
  const isMixedTournament = $derived(wizard.formData.tournamentType === 'mixed');
  const isDoubleTournament = $derived(wizard.formData.tournamentType === 'double');

  // Compter les participants valides
  let validCount = $derived(
    participants.filter((p) => p.firstName.trim() && p.lastName.trim()).length
  );

  // Compter H/F pour les tournois mixtes
  let maleCount = $derived(
    participants.filter((p) => p.firstName.trim() && p.lastName.trim() && p.gender === 'M').length
  );
  let femaleCount = $derived(
    participants.filter((p) => p.firstName.trim() && p.lastName.trim() && p.gender === 'F').length
  );
  let genderUnassignedCount = $derived(
    participants.filter((p) => p.firstName.trim() && p.lastName.trim() && !p.gender).length
  );

  // Verifier si on peut passer a l'etape suivante
  let canProceed = $derived(() => {
    // Minimum 4 participants
    if (validCount < 4) return false;

    // Pour les tournois double: nombre pair
    if (isDoubleTournament && validCount % 2 !== 0) return false;

    // Pour les tournois mixtes: tous les genres assignes et egalite H/F
    if (isMixedTournament) {
      if (genderUnassignedCount > 0) return false;
      if (maleCount !== femaleCount) return false;
    }

    return true;
  });

  // Ajouter un participant vide
  function addParticipant() {
    participants = [
      ...participants,
      {
        id: crypto.randomUUID(),
        firstName: '',
        lastName: ''
      }
    ];
  }

  // Mettre a jour un participant
  function updateParticipant(index: number, data: Partial<WizardParticipant>) {
    participants = participants.map((p, i) => (i === index ? { ...p, ...data } : p));
  }

  // Supprimer un participant
  function removeParticipant(index: number) {
    participants = participants.filter((_, i) => i !== index);
  }

  // Ajouter 4 participants vides pour demarrer
  function addInitialParticipants() {
    const newParticipants: WizardParticipant[] = Array.from({ length: 4 }, () => ({
      id: crypto.randomUUID(),
      firstName: '',
      lastName: ''
    }));
    participants = [...participants, ...newParticipants];
  }

  // Navigation
  function handlePrev() {
    // Sauvegarder les participants (meme incomplets)
    wizard.updateFormData({ participants });
    wizard.prevStep();
  }

  function handleNext() {
    // Mettre a jour le context
    wizard.updateFormData({ participants });

    // Valider et passer a l'etape suivante
    if (wizard.validateStep2()) {
      wizard.nextStep();
    }
  }

  // Initialiser avec 4 lignes vides si aucun participant
  $effect(() => {
    if (participants.length === 0) {
      addInitialParticipants();
    }
  });
</script>

<div class="space-y-6">
  <div>
    <h2 class="heading-2 text-text-primary mb-2">Participants</h2>
    <p class="text-small text-text-secondary">
      Ajoutez les joueurs qui participeront au tournoi. Minimum 4 participants requis.
    </p>
  </div>

  <!-- Stats -->
  <div class="flex flex-wrap items-center gap-4">
    <span class="inline-flex items-center gap-1.5 bg-accent/10 text-accent border border-accent/20 text-xs font-semibold px-2 py-1 rounded-md">
      <Users class="size-4" />
      {validCount} joueur{validCount !== 1 ? 's' : ''} valide{validCount !== 1 ? 's' : ''}
    </span>
    {#if validCount < 4}
      <span class="inline-flex items-center gap-1.5 bg-danger/10 text-danger border border-danger/20 text-xs font-semibold px-2 py-1 rounded-md">
        Il manque {4 - validCount} joueur{4 - validCount !== 1 ? 's' : ''}
      </span>
    {:else if isMixedTournament && maleCount !== femaleCount}
      <span class="inline-flex items-center gap-1.5 bg-warning/10 text-warning border border-warning/20 text-xs font-semibold px-2 py-1 rounded-md">
        Desequilibre: {maleCount} H / {femaleCount} F
      </span>
    {:else if isMixedTournament && genderUnassignedCount > 0}
      <span class="inline-flex items-center gap-1.5 bg-warning/10 text-warning border border-warning/20 text-xs font-semibold px-2 py-1 rounded-md">
        {genderUnassignedCount} sans genre
      </span>
    {:else if isDoubleTournament && validCount % 2 !== 0}
      <span class="inline-flex items-center gap-1.5 bg-warning/10 text-warning border border-warning/20 text-xs font-semibold px-2 py-1 rounded-md">
        Nombre impair de joueurs
      </span>
    {:else}
      <span class="inline-flex items-center gap-1.5 bg-success/10 text-success border border-success/20 text-xs font-semibold px-2 py-1 rounded-md">
        Pret pour l'etape suivante
      </span>
    {/if}
  </div>

  <!-- Stats genre pour tournois mixtes -->
  {#if isMixedTournament}
    <div class="flex items-center gap-4">
      <span class="inline-block bg-bg-tertiary text-text-secondary border border-border text-xs font-medium px-2 py-1 rounded-md">
        Hommes: {maleCount}
      </span>
      <span class="inline-block bg-bg-tertiary text-text-secondary border border-border text-xs font-medium px-2 py-1 rounded-md">
        Femmes: {femaleCount}
      </span>
      {#if genderUnassignedCount > 0}
        <span class="inline-block bg-warning/10 text-warning border border-warning/20 text-xs font-medium px-2 py-1 rounded-md">
          Non assignes: {genderUnassignedCount}
        </span>
      {/if}
    </div>
  {/if}

  <!-- Erreur globale -->
  {#if wizard.getError('participants')}
    <div role="alert" class="bg-danger/10 border border-danger/20 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <AlertCircle class="size-5 text-danger shrink-0" />
        <span class="text-small text-text-primary">{wizard.getError('participants')}</span>
      </div>
    </div>
  {/if}

  <!-- Liste des participants -->
  <div class="space-y-2">
    <!-- En-tete (visible sur desktop) -->
    <div
      class="hidden md:grid grid-cols-12 gap-2 px-3 py-2 text-caption text-text-muted"
    >
      <div class="col-span-1">#</div>
      <div class={showGender ? "col-span-2" : "col-span-2"}>Prenom</div>
      <div class={showGender ? "col-span-2" : "col-span-2"}>Nom</div>
      {#if showGender}
        <div class="col-span-1">Genre</div>
      {/if}
      <div class="col-span-3">Email</div>
      <div class={showGender ? "col-span-2" : "col-span-3"}>Niveau</div>
      <div class="col-span-1"></div>
    </div>

    <!-- Lignes des participants -->
    <div class="space-y-2 max-h-[400px] overflow-y-auto">
      {#each participants as participant, index (participant.id)}
        <ParticipantRow
          {participant}
          {index}
          onupdate={updateParticipant}
          onremove={removeParticipant}
          errorFirstName={wizard.getError(`participant_${index}_firstName`)}
          errorLastName={wizard.getError(`participant_${index}_lastName`)}
          errorGender={wizard.getError(`participant_${index}_gender`)}
          {showGender}
        />
      {/each}
    </div>

    <!-- Bouton ajouter -->
    <button
      type="button"
      onclick={addParticipant}
      class="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-bg-secondary text-text-primary text-button px-4 py-2.5 border border-border border-dashed rounded-lg transition-colors duration-200"
    >
      <Plus class="size-5" />
      Ajouter un joueur
    </button>
  </div>

  <!-- Navigation -->
  <div class="flex justify-between pt-4 border-t border-border">
    <button
      class="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-bg-secondary text-text-primary text-button px-4 py-2 rounded-lg transition-colors duration-200"
      onclick={handlePrev}
    >
      <ArrowLeft class="size-5" />
      Precedent
    </button>
    <button
      class="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white text-button px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      onclick={handleNext}
      disabled={!canProceed()}
    >
      Suivant
      <ArrowRight class="size-5" />
    </button>
  </div>
</div>
