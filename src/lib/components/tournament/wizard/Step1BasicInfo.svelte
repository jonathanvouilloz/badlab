<script lang="ts">
  import { onMount } from 'svelte';
  import { getWizardContext } from './WizardContext.svelte';
  import { ArrowRight, Info } from 'lucide-svelte';
  import type { TournamentType } from './types';

  // Import cally only on client side (SSR-safe)
  onMount(() => {
    import('cally');
  });

  const wizard = getWizardContext();

  // Local state synced with wizard
  let name = $state(wizard.formData.name);
  let startDate = $state(wizard.formData.startDate);
  let startTime = $state(wizard.formData.startTime);
  let location = $state(wizard.formData.location);
  let description = $state(wizard.formData.description);
  let tournamentType = $state<TournamentType>(wizard.formData.tournamentType);

  // Calendar element reference
  let calendarEl: HTMLElement | null = $state(null);

  // Options pour le type de tournoi
  const tournamentTypes: { value: TournamentType; label: string; description: string }[] = [
    { value: 'single', label: 'Simple', description: 'Matchs individuels (1 contre 1)' },
    { value: 'double', label: 'Double', description: 'Equipes de 2 joueurs' },
    { value: 'mixed', label: 'Mixte', description: 'Equipes homme/femme' }
  ];

  function handleNext() {
    wizard.updateFormData({
      name,
      startDate,
      startTime,
      location,
      description,
      tournamentType
    });

    if (wizard.validateStep1()) {
      wizard.nextStep();
    }
  }

  function formatDisplayDate(dateString: string): string {
    if (!dateString) return 'Selectionnez une date';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  const today = new Date().toISOString().split('T')[0];

  // Setup calendar event listener
  $effect(() => {
    if (calendarEl) {
      const handleChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        startDate = target.value;
        // Close popover after selection
        const popover = document.getElementById('date-popover');
        if (popover) {
          (popover as HTMLElement & { hidePopover: () => void }).hidePopover();
        }
      };
      calendarEl.addEventListener('change', handleChange);
      return () => {
        calendarEl?.removeEventListener('change', handleChange);
      };
    }
  });
</script>

<div class="space-y-6">
  <div>
    <h2 class="heading-2 text-text-primary mb-2">Informations du tournoi</h2>
    <p class="text-small text-text-secondary">
      Renseignez les informations de base de votre tournoi.
    </p>
  </div>

  <div class="space-y-4">
    <!-- Nom du tournoi -->
    <fieldset class="fieldset">
      <legend class="text-label text-text-primary">Nom du tournoi <span class="text-danger">*</span></legend>
      <input
        type="text"
        placeholder="Ex: Tournoi du club printemps 2024"
        bind:value={name}
        class="w-full bg-white text-text-primary placeholder:text-text-muted border border-border rounded-lg px-4 py-2.5 text-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors duration-200 {wizard.getError('name') ? 'border-danger focus:ring-danger' : ''}"
      />
      {#if wizard.getError('name')}
        <p class="text-xs text-danger mt-1.5">{wizard.getError('name')}</p>
      {/if}
    </fieldset>

    <!-- Date et heure -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <fieldset class="fieldset">
        <legend class="text-label text-text-primary">Date du tournoi <span class="text-danger">*</span></legend>

        <!-- Popover trigger button -->
        <button
          type="button"
          popovertarget="date-popover"
          class="w-full bg-white text-left border border-border rounded-lg px-4 py-2.5 text-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors duration-200 {wizard.getError('startDate') ? 'border-danger focus:ring-danger' : ''} {!startDate ? 'text-text-muted' : 'text-text-primary'}"
          style="anchor-name: --date-picker"
        >
          {formatDisplayDate(startDate)}
        </button>

        <!-- Popover calendar -->
        <div
          popover
          id="date-popover"
          class="dropdown bg-base-100 rounded-box shadow-lg"
          style="position-anchor: --date-picker"
        >
          <calendar-date
            bind:this={calendarEl}
            class="cally"
            value={startDate}
            min={today}
          >
            <svg
              aria-label="Previous"
              class="fill-current size-4"
              slot="previous"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
            </svg>
            <svg
              aria-label="Next"
              class="fill-current size-4"
              slot="next"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
            </svg>
            <calendar-month></calendar-month>
          </calendar-date>
        </div>

        {#if wizard.getError('startDate')}
          <p class="text-xs text-danger mt-1.5">{wizard.getError('startDate')}</p>
        {/if}
      </fieldset>

      <fieldset class="fieldset">
        <legend class="text-label text-text-primary">Heure de debut</legend>
        <input
          type="time"
          placeholder="09:00"
          bind:value={startTime}
          class="w-full bg-white text-text-primary placeholder:text-text-muted border border-border rounded-lg px-4 py-2.5 text-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors duration-200"
        />
        <p class="text-xs text-text-muted mt-1.5">Optionnel</p>
      </fieldset>
    </div>

    <!-- Lieu -->
    <fieldset class="fieldset">
      <legend class="text-label text-text-primary">Lieu</legend>
      <input
        type="text"
        placeholder="Ex: Salle de sport du club"
        bind:value={location}
        class="w-full bg-white text-text-primary placeholder:text-text-muted border border-border rounded-lg px-4 py-2.5 text-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors duration-200"
      />
      <p class="text-xs text-text-muted mt-1.5">Optionnel</p>
    </fieldset>

    <!-- Type de tournoi -->
    <div class="space-y-2">
      <label class="text-label text-text-primary">Type de tournoi <span class="text-danger">*</span></label>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        {#each tournamentTypes as type}
          <label
            class="bg-white border-2 cursor-pointer hover:border-accent hover:bg-accent/5 transition-all duration-200 rounded-lg {tournamentType === type.value ? 'border-accent bg-accent/5' : 'border-border'}"
          >
            <div class="p-4 flex flex-col items-center text-center gap-2">
              <input
                type="radio"
                name="tournamentType"
                value={type.value}
                class="radio radio-accent"
                bind:group={tournamentType}
              />
              <span class="font-semibold text-text-primary">{type.label}</span>
              <span class="text-small text-text-secondary">{type.description}</span>
            </div>
          </label>
        {/each}
      </div>
    </div>

    <!-- Description -->
    <fieldset class="fieldset">
      <legend class="text-label text-text-primary">Description</legend>
      <textarea
        bind:value={description}
        placeholder="Informations supplementaires sur le tournoi..."
        class="w-full bg-white text-text-primary placeholder:text-text-muted border border-border rounded-lg px-4 py-2.5 text-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors duration-200 h-24"
        rows="3"
      ></textarea>
      <p class="text-xs text-text-muted mt-1.5">Optionnel - Visible par les participants</p>
    </fieldset>

    <!-- Info box -->
    <div role="alert" class="bg-info/10 border border-info/20 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <Info class="size-5 text-info shrink-0" />
        <div>
          <h3 class="font-semibold text-text-primary mb-1">Format du tournoi</h3>
          <p class="text-small text-text-secondary">
            Ce wizard cree un tournoi a <strong>elimination directe</strong> avec inscription manuelle
            des participants. D'autres formats seront disponibles prochainement.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="flex justify-end pt-4 border-t border-border">
    <button
      class="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white text-button px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      onclick={handleNext}
    >
      Suivant
      <ArrowRight class="size-5" />
    </button>
  </div>
</div>
