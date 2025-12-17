<script lang="ts">
  import { Trash2 } from 'lucide-svelte';
  import type { WizardParticipant, ParticipantLevel, Gender } from './types';

  interface Props {
    participant: WizardParticipant;
    index: number;
    onupdate: (index: number, data: Partial<WizardParticipant>) => void;
    onremove: (index: number) => void;
    errorFirstName?: string;
    errorLastName?: string;
    errorGender?: string;
    showGender?: boolean; // Afficher le selecteur de genre (pour double/mixed)
  }

  let { participant, index, onupdate, onremove, errorFirstName, errorLastName, errorGender, showGender = false }: Props = $props();

  const levels: { value: ParticipantLevel | ''; label: string }[] = [
    { value: '', label: 'Niveau' },
    { value: 'beginner', label: 'Debutant' },
    { value: 'intermediate', label: 'Intermediaire' },
    { value: 'advanced', label: 'Avance' },
    { value: 'competition', label: 'Competition' }
  ];

  const genders: { value: Gender | ''; label: string }[] = [
    { value: '', label: 'Genre' },
    { value: 'M', label: 'Homme' },
    { value: 'F', label: 'Femme' }
  ];
</script>

<div class="grid grid-cols-12 gap-2 items-start p-3 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border transition-colors">
  <!-- Numero -->
  <div class="col-span-1 flex items-center justify-center">
    <span class="inline-flex items-center justify-center bg-bg-tertiary text-text-secondary border border-border text-xs font-semibold size-7 rounded-md">
      {index + 1}
    </span>
  </div>

  <!-- Prenom -->
  <div class={showGender ? "col-span-4 md:col-span-2" : "col-span-5 md:col-span-2"}>
    <input
      type="text"
      placeholder="Prenom *"
      value={participant.firstName}
      oninput={(e) => onupdate(index, { firstName: e.currentTarget.value })}
      class="w-full bg-white text-text-primary placeholder:text-text-muted border rounded-lg px-3 py-1.5 text-small focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors duration-200 {errorFirstName ? 'border-danger focus:ring-danger' : 'border-border'}"
    />
    {#if errorFirstName}
      <p class="text-xs text-danger mt-1">{errorFirstName}</p>
    {/if}
  </div>

  <!-- Nom -->
  <div class={showGender ? "col-span-4 md:col-span-2" : "col-span-5 md:col-span-2"}>
    <input
      type="text"
      placeholder="Nom *"
      value={participant.lastName}
      oninput={(e) => onupdate(index, { lastName: e.currentTarget.value })}
      class="w-full bg-white text-text-primary placeholder:text-text-muted border rounded-lg px-3 py-1.5 text-small focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors duration-200 {errorLastName ? 'border-danger focus:ring-danger' : 'border-border'}"
    />
    {#if errorLastName}
      <p class="text-xs text-danger mt-1">{errorLastName}</p>
    {/if}
  </div>

  <!-- Genre (visible seulement pour double/mixed) -->
  {#if showGender}
    <div class="col-span-2 md:col-span-1">
      <select
        value={participant.gender ?? ''}
        onchange={(e) => onupdate(index, { gender: (e.currentTarget.value as Gender) || undefined })}
        class="w-full bg-white text-text-primary border rounded-lg px-2 py-1.5 text-small focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent cursor-pointer transition-colors duration-200 {errorGender ? 'border-danger focus:ring-danger' : 'border-border'}"
      >
        {#each genders as g}
          <option value={g.value}>{g.label}</option>
        {/each}
      </select>
      {#if errorGender}
        <p class="text-xs text-danger mt-1">{errorGender}</p>
      {/if}
    </div>
  {/if}

  <!-- Email (cache sur mobile) -->
  <div class={showGender ? "hidden md:block md:col-span-3" : "hidden md:block md:col-span-3"}>
    <input
      type="email"
      placeholder="Email (optionnel)"
      value={participant.email ?? ''}
      oninput={(e) => onupdate(index, { email: e.currentTarget.value || undefined })}
      class="w-full bg-white text-text-primary placeholder:text-text-muted border border-border rounded-lg px-3 py-1.5 text-small focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors duration-200"
    />
  </div>

  <!-- Niveau (cache sur mobile) -->
  <div class={showGender ? "hidden md:block md:col-span-2" : "hidden md:block md:col-span-3"}>
    <select
      value={participant.level ?? ''}
      onchange={(e) => onupdate(index, { level: (e.currentTarget.value as ParticipantLevel) || undefined })}
      class="w-full bg-white text-text-primary border border-border rounded-lg px-2 py-1.5 text-small focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent cursor-pointer transition-colors duration-200"
    >
      {#each levels as level}
        <option value={level.value}>{level.label}</option>
      {/each}
    </select>
  </div>

  <!-- Bouton supprimer -->
  <div class="col-span-1 flex items-center justify-center">
    <button
      type="button"
      onclick={() => onremove(index)}
      class="inline-flex items-center justify-center size-8 bg-transparent hover:bg-danger/10 text-danger rounded-lg transition-colors duration-200"
      title="Supprimer ce participant"
    >
      <Trash2 class="size-4" />
    </button>
  </div>
</div>
