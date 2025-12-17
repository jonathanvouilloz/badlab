<script lang="ts">
  import { getWizardContext } from './WizardContext.svelte';
  import { ArrowLeft, ArrowRight, Shuffle, ListOrdered, GripVertical, Info } from 'lucide-svelte';
  import type { SeedingMethod, WizardParticipant } from './types';

  const wizard = getWizardContext();

  // Local state
  let seedingMethod = $state<SeedingMethod>(wizard.formData.seedingMethod);
  let participantOrder = $state<string[]>(
    wizard.formData.participantOrder.length > 0
      ? wizard.formData.participantOrder
      : wizard.formData.participants.map((p) => p.id)
  );

  // Map pour retrouver les infos des participants par ID
  let participantsMap = $derived(new Map(wizard.formData.participants.map((p) => [p.id, p])));

  // Participants ordonnes pour l'affichage
  let orderedParticipants = $derived(
    participantOrder
      .map((id) => participantsMap.get(id))
      .filter((p): p is WizardParticipant => p !== undefined)
  );

  // Drag and drop state
  let draggedIndex = $state<number | null>(null);
  let dragOverIndex = $state<number | null>(null);

  // Options de seeding
  const seedingOptions: {
    value: SeedingMethod;
    label: string;
    description: string;
    icon: typeof Shuffle;
  }[] = [
    {
      value: 'random',
      label: 'Placement aleatoire',
      description: 'Les joueurs seront melanges au hasard dans le tableau',
      icon: Shuffle
    },
    {
      value: 'manual',
      label: 'Seeding manuel',
      description: 'Ordonnez les joueurs par niveau (1 = tete de serie)',
      icon: ListOrdered
    }
  ];

  // Drag and drop handlers
  function handleDragStart(index: number) {
    draggedIndex = index;
  }

  function handleDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    dragOverIndex = index;
  }

  function handleDragLeave() {
    dragOverIndex = null;
  }

  function handleDrop(targetIndex: number) {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      draggedIndex = null;
      dragOverIndex = null;
      return;
    }

    const newOrder = [...participantOrder];
    const [moved] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, moved);
    participantOrder = newOrder;

    draggedIndex = null;
    dragOverIndex = null;
  }

  function handleDragEnd() {
    draggedIndex = null;
    dragOverIndex = null;
  }

  // Navigation
  function handlePrev() {
    wizard.updateFormData({
      seedingMethod,
      participantOrder: seedingMethod === 'manual' ? participantOrder : []
    });
    wizard.prevStep();
  }

  function handleNext() {
    wizard.updateFormData({
      seedingMethod,
      participantOrder: seedingMethod === 'manual' ? participantOrder : []
    });

    if (wizard.validateStep3()) {
      wizard.nextStep();
    }
  }

  // Helper for drag item classes
  function getDragItemClasses(index: number): string {
    const base = 'flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-move bg-white';
    const isDragged = draggedIndex === index;
    const isDragOver = dragOverIndex === index && draggedIndex !== index;
    const isNormal = !isDragged && !isDragOver;

    let classes = base;
    if (isDragged) classes += ' opacity-50 border-accent';
    if (isDragOver) classes += ' border-accent border-2 bg-accent/5';
    if (isNormal) classes += ' border-border hover:bg-bg-secondary';
    return classes;
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="heading-2 text-text-primary mb-2">Configuration</h2>
    <p class="text-small text-text-secondary">
      Choisissez comment les joueurs seront places dans le tableau du tournoi.
    </p>
  </div>

  <!-- Seeding method selection -->
  <div class="space-y-3">
    <p class="text-label text-text-primary">Methode de placement</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each seedingOptions as option}
        <label
          class="bg-white border-2 cursor-pointer hover:border-accent hover:bg-accent/5 transition-all duration-200 rounded-xl {seedingMethod === option.value ? 'border-accent bg-accent/5' : 'border-border'}"
        >
          <div class="p-4">
            <div class="flex items-start gap-3">
              <input
                type="radio"
                name="seedingMethod"
                value={option.value}
                class="radio radio-accent mt-1"
                bind:group={seedingMethod}
              />
              <div
                class="size-10 rounded-lg flex items-center justify-center shrink-0 {seedingMethod === option.value ? 'bg-accent/10' : 'bg-bg-tertiary'}"
              >
                <option.icon
                  class="size-5 {seedingMethod === option.value ? 'text-accent' : 'text-text-muted'}"
                />
              </div>
              <div>
                <div class="font-semibold text-text-primary">{option.label}</div>
                <div class="text-small text-text-secondary">{option.description}</div>
              </div>
            </div>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!-- Manual seeding list -->
  {#if seedingMethod === 'manual'}
    <div class="space-y-3">
      <div role="alert" class="bg-info/10 border border-info/20 rounded-xl p-4">
        <div class="flex items-start gap-3">
          <Info class="size-5 text-info shrink-0" />
          <span class="text-small text-text-primary">
            Glissez-deposez les joueurs pour les ordonner. Le joueur en position 1 sera la tete de
            serie principale.
          </span>
        </div>
      </div>

      <div class="space-y-2">
        {#each orderedParticipants as participant, index (participant.id)}
          <div
            draggable="true"
            ondragstart={() => handleDragStart(index)}
            ondragover={(e) => handleDragOver(e, index)}
            ondragleave={handleDragLeave}
            ondrop={() => handleDrop(index)}
            ondragend={handleDragEnd}
            class={getDragItemClasses(index)}
          >
            <!-- Seed number -->
            <span class="inline-flex items-center justify-center bg-accent text-white text-xs font-bold size-7 rounded-full">
              {index + 1}
            </span>

            <!-- Drag handle -->
            <GripVertical class="size-5 text-text-muted" />

            <!-- Player name -->
            <div class="flex-1">
              <span class="font-medium text-text-primary">
                {participant.firstName}
                {participant.lastName}
              </span>
              {#if participant.level}
                <span class="inline-block bg-bg-tertiary text-text-secondary text-xs font-medium px-2 py-0.5 rounded-md ml-2 capitalize">
                  {participant.level}
                </span>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <!-- Random seeding info -->
    <div class="p-6 rounded-xl bg-bg-secondary text-center">
      <Shuffle class="size-12 text-text-muted mx-auto mb-4" />
      <p class="text-small text-text-secondary">
        Les {wizard.formData.participants.length} participants seront places aleatoirement dans le tableau.
      </p>
    </div>
  {/if}

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
      class="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white text-button px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      onclick={handleNext}
    >
      Suivant
      <ArrowRight class="size-5" />
    </button>
  </div>
</div>
