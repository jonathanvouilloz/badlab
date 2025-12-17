<script lang="ts">
  import { useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { getFunctionName } from 'convex/server';
  import type { Id, Doc } from '$convex/_generated/dataModel';
  import { Modal, Button, Input } from '$lib/components/ui';

  type Level = 'beginner' | 'intermediate' | 'advanced' | 'competition';

  interface Props {
    open: boolean;
    tournamentId: Id<'tournaments'>;
    participant?: Doc<'participants'> | null;
    onSave?: () => void;
  }

  let { open = $bindable(false), tournamentId, participant = null, onSave }: Props = $props();

  const convexClient = useConvexClient();

  // Form state
  let firstName = $state('');
  let lastName = $state('');
  let email = $state('');
  let club = $state('');
  let level = $state<Level | ''>('');

  let saving = $state(false);
  let error = $state('');

  // Is edit mode
  let isEdit = $derived(!!participant);

  // Reset form when modal opens or participant changes
  $effect(() => {
    if (open) {
      if (participant) {
        firstName = participant.firstName;
        lastName = participant.lastName;
        email = participant.email ?? '';
        club = participant.club ?? '';
        level = participant.level ?? '';
      } else {
        firstName = '';
        lastName = '';
        email = '';
        club = '';
        level = '';
      }
      error = '';
    }
  });

  // Validation
  let isValid = $derived(firstName.trim() !== '' && lastName.trim() !== '');

  // Save handler
  async function handleSave() {
    if (!isValid) return;

    saving = true;
    error = '';

    try {
      if (isEdit && participant) {
        // Update existing
        await convexClient.mutation(
          getFunctionName(api.participants.update),
          {
            id: participant._id,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim() || undefined,
            club: club.trim() || undefined,
            level: level || undefined,
          }
        );
      } else {
        // Create new
        await convexClient.mutation(
          getFunctionName(api.participants.create),
          {
            tournamentId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim() || undefined,
            club: club.trim() || undefined,
            level: level || undefined,
          }
        );
      }

      onSave?.();
    } catch (err) {
      console.error('Erreur sauvegarde participant:', err);
      error = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
    } finally {
      saving = false;
    }
  }

  function handleClose() {
    open = false;
  }
</script>

<Modal bind:open title={isEdit ? 'Modifier le participant' : 'Ajouter un participant'} size="default">
  <form class="space-y-4" onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
    <div class="grid grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label" for="firstName">
          <span class="label-text font-medium">Prenom <span class="text-danger">*</span></span>
        </label>
        <input
          type="text"
          id="firstName"
          bind:value={firstName}
          placeholder="Jean"
          class="input input-bordered w-full"
          required
        />
      </div>
      <div class="form-control">
        <label class="label" for="lastName">
          <span class="label-text font-medium">Nom <span class="text-danger">*</span></span>
        </label>
        <input
          type="text"
          id="lastName"
          bind:value={lastName}
          placeholder="Dupont"
          class="input input-bordered w-full"
          required
        />
      </div>
    </div>

    <div class="form-control">
      <label class="label" for="email">
        <span class="label-text font-medium">Email</span>
      </label>
      <input
        type="email"
        id="email"
        bind:value={email}
        placeholder="jean.dupont@email.com"
        class="input input-bordered w-full"
      />
    </div>

    <div class="form-control">
      <label class="label" for="club">
        <span class="label-text font-medium">Club</span>
      </label>
      <input
        type="text"
        id="club"
        bind:value={club}
        placeholder="BC Paris"
        class="input input-bordered w-full"
      />
    </div>

    <div class="form-control">
      <label class="label" for="level">
        <span class="label-text font-medium">Niveau</span>
      </label>
      <select
        id="level"
        bind:value={level}
        class="select select-bordered w-full"
      >
        <option value="">Non specifie</option>
        <option value="beginner">Debutant</option>
        <option value="intermediate">Intermediaire</option>
        <option value="advanced">Avance</option>
        <option value="competition">Competition</option>
      </select>
    </div>

    {#if error}
      <div class="p-3 bg-danger/10 border border-danger/20 rounded-lg">
        <p class="text-sm text-danger">{error}</p>
      </div>
    {/if}
  </form>

  {#snippet footer()}
    <Button variant="secondary" onclick={handleClose} disabled={saving}>
      Annuler
    </Button>
    <Button onclick={handleSave} disabled={!isValid || saving}>
      {#if saving}
        Sauvegarde...
      {:else if isEdit}
        Modifier
      {:else}
        Ajouter
      {/if}
    </Button>
  {/snippet}
</Modal>
