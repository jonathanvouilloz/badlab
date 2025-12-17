<script lang="ts">
  import { useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { getFunctionName } from 'convex/server';
  import type { Id, Doc } from '$convex/_generated/dataModel';
  import { Card, Button } from '$lib/components/ui';
  import { Plus, Pencil, Trash2, Users, AlertCircle } from 'lucide-svelte';
  import ParticipantForm from './ParticipantForm.svelte';

  interface Props {
    tournamentId: Id<'tournaments'>;
    participants: Doc<'participants'>[];
    isDraft: boolean;
  }

  let { tournamentId, participants, isDraft }: Props = $props();

  const convexClient = useConvexClient();

  // Modal state
  let showForm = $state(false);
  let editingParticipant = $state<Doc<'participants'> | null>(null);
  let deleteConfirm = $state<Doc<'participants'> | null>(null);
  let deleting = $state(false);
  let error = $state('');

  // Open form for new participant
  function handleAddNew() {
    editingParticipant = null;
    showForm = true;
  }

  // Open form for editing
  function handleEdit(participant: Doc<'participants'>) {
    editingParticipant = participant;
    showForm = true;
  }

  // Delete confirmation
  function handleDeleteClick(participant: Doc<'participants'>) {
    deleteConfirm = participant;
  }

  // Confirm delete
  async function handleConfirmDelete() {
    if (!deleteConfirm) return;

    deleting = true;
    error = '';

    try {
      await convexClient.mutation(
        getFunctionName(api.participants.remove),
        { id: deleteConfirm._id }
      );
      deleteConfirm = null;
    } catch (err) {
      console.error('Erreur suppression:', err);
      error = 'Erreur lors de la suppression';
    } finally {
      deleting = false;
    }
  }

  // Cancel delete
  function handleCancelDelete() {
    deleteConfirm = null;
  }

  // Form saved callback
  function handleFormSaved() {
    showForm = false;
    editingParticipant = null;
  }

  // Level label helper
  function getLevelLabel(level: string | undefined): string {
    switch (level) {
      case 'beginner':
        return 'Debutant';
      case 'intermediate':
        return 'Intermediaire';
      case 'advanced':
        return 'Avance';
      case 'competition':
        return 'Competition';
      default:
        return '-';
    }
  }

  function getLevelBadgeClass(level: string | undefined): string {
    switch (level) {
      case 'beginner':
        return 'bg-info/10 text-info border-info/20';
      case 'intermediate':
        return 'bg-success/10 text-success border-success/20';
      case 'advanced':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'competition':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-bg-tertiary text-text-secondary border-border';
    }
  }
</script>

<Card hover={false} padding="none">
  <div class="p-4 border-b border-border">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="size-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Users class="size-5 text-accent" />
        </div>
        <div>
          <h2 class="font-semibold text-text-primary">Participants</h2>
          <p class="text-sm text-text-secondary">{participants.length} joueur{participants.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      {#if isDraft}
        <Button variant="primary" size="sm" onclick={handleAddNew}>
          <Plus class="size-4" />
          Ajouter
        </Button>
      {/if}
    </div>
  </div>

  {#if error}
    <div class="p-4 bg-danger/10 border-b border-danger/20">
      <div class="flex items-center gap-2 text-danger">
        <AlertCircle class="size-4" />
        <span class="text-sm">{error}</span>
      </div>
    </div>
  {/if}

  {#if participants.length === 0}
    <div class="p-8 text-center">
      <p class="text-text-secondary mb-4">Aucun participant pour le moment.</p>
      {#if isDraft}
        <Button variant="secondary" onclick={handleAddNew}>
          <Plus class="size-4" />
          Ajouter le premier participant
        </Button>
      {/if}
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th class="w-12">#</th>
            <th>Nom</th>
            <th class="hidden md:table-cell">Club</th>
            <th>Niveau</th>
            {#if isDraft}
              <th class="w-24 text-right">Actions</th>
            {/if}
          </tr>
        </thead>
        <tbody>
          {#each participants as participant, i}
            <tr class="hover">
              <td class="text-text-muted">{i + 1}</td>
              <td>
                <div class="font-medium">{participant.firstName} {participant.lastName}</div>
                {#if participant.email}
                  <div class="text-xs text-text-muted">{participant.email}</div>
                {/if}
              </td>
              <td class="hidden md:table-cell text-text-muted">{participant.club ?? '-'}</td>
              <td>
                <span class="inline-flex items-center border text-xs font-semibold px-2 py-1 rounded-md {getLevelBadgeClass(participant.level)}">
                  {getLevelLabel(participant.level)}
                </span>
              </td>
              {#if isDraft}
                <td>
                  <div class="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      class="btn btn-ghost btn-xs"
                      onclick={() => handleEdit(participant)}
                      aria-label="Modifier"
                    >
                      <Pencil class="size-4" />
                    </button>
                    <button
                      type="button"
                      class="btn btn-ghost btn-xs text-danger"
                      onclick={() => handleDeleteClick(participant)}
                      aria-label="Supprimer"
                    >
                      <Trash2 class="size-4" />
                    </button>
                  </div>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</Card>

<!-- Participant Form Modal -->
<ParticipantForm
  bind:open={showForm}
  {tournamentId}
  participant={editingParticipant}
  onSave={handleFormSaved}
/>

<!-- Delete Confirmation Modal (DaisyUI) -->
<dialog class="modal" class:modal-open={deleteConfirm !== null}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Confirmer la suppression</h3>
    {#if deleteConfirm}
      <p class="py-4">
        Voulez-vous vraiment supprimer <strong>{deleteConfirm.firstName} {deleteConfirm.lastName}</strong> ?
      </p>
    {/if}
    <div class="modal-action">
      <button type="button" class="btn" onclick={handleCancelDelete} disabled={deleting}>
        Annuler
      </button>
      <button type="button" class="btn bg-danger hover:bg-danger/90 text-white border-none" onclick={handleConfirmDelete} disabled={deleting}>
        {#if deleting}
          <span class="loading loading-spinner loading-sm"></span>
        {/if}
        Supprimer
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button type="button" onclick={handleCancelDelete}>close</button>
  </form>
</dialog>
