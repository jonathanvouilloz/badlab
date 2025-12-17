<script lang="ts">
  import { useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { getFunctionName } from 'convex/server';
  import { Modal, Button, Input } from '$lib/components/ui';
  import type { BracketMatch } from './types';

  interface Props {
    open: boolean;
    match: BracketMatch;
    onSave?: () => void;
  }

  let { open = $bindable(false), match, onSave }: Props = $props();

  const convexClient = useConvexClient();

  // State des scores
  let scores1 = $state<(number | null)[]>([null, null, null]);
  let scores2 = $state<(number | null)[]>([null, null, null]);
  let nbSets = $state(2);
  let saving = $state(false);
  let error = $state('');

  // Mode edition (match deja termine)
  let isEditMode = $derived(match.status === 'finished');

  // Detecter si c'est un match d'equipes
  let isTeamMatch = $derived(match.team1Id || match.team2Id);

  // Noms des participants ou equipes
  // Utiliser participant1DisplayName si disponible (calcule par le backend)
  let participant1Name = $derived(
    (match as any).participant1DisplayName ||
    (match.participant1
      ? `${match.participant1.firstName} ${match.participant1.lastName}`
      : (isTeamMatch ? 'Equipe 1' : 'Joueur 1'))
  );

  let participant2Name = $derived(
    (match as any).participant2DisplayName ||
    (match.participant2
      ? `${match.participant2.firstName} ${match.participant2.lastName}`
      : (isTeamMatch ? 'Equipe 2' : 'Joueur 2'))
  );

  // Calcul du vainqueur actuel
  let setsWon1 = $derived(
    scores1.slice(0, nbSets).filter((s, i) => s !== null && scores2[i] !== null && s > (scores2[i] ?? 0)).length
  );

  let setsWon2 = $derived(
    scores2.slice(0, nbSets).filter((s, i) => s !== null && scores1[i] !== null && s > (scores1[i] ?? 0)).length
  );

  let hasWinner = $derived(setsWon1 >= 2 || setsWon2 >= 2);

  let winnerName = $derived(
    setsWon1 >= 2 ? participant1Name : setsWon2 >= 2 ? participant2Name : null
  );

  // Calcul du nouveau vainqueur potentiel (participant ou equipe)
  let newWinnerId = $derived(() => {
    if (setsWon1 >= 2) {
      return isTeamMatch ? match.team1Id : match.participant1?._id;
    }
    if (setsWon2 >= 2) {
      return isTeamMatch ? match.team2Id : match.participant2?._id;
    }
    return null;
  });

  // Verifie si on changerait le vainqueur en mode edition
  let wouldChangeWinner = $derived(
    isEditMode && match.winnerId && newWinnerId() && newWinnerId() !== match.winnerId
  );

  /**
   * Valide un score de set selon les regles du badminton:
   * - Score gagnant >= 21
   * - Ecart de 2 points requis
   * - Score max 30 (plus besoin d'ecart a 30)
   */
  function isValidSetScore(s1: number, s2: number): boolean {
    const winner = Math.max(s1, s2);
    const loser = Math.min(s1, s2);

    // Score gagnant doit etre >= 21
    if (winner < 21) return false;

    // Score max est 30
    if (winner > 30 || loser > 30) return false;

    // A 30 points, pas besoin d'ecart de 2
    if (winner === 30) return true;

    // Sinon, ecart de 2 points minimum
    return winner - loser >= 2;
  }

  // Validation de chaque set
  let setValidation = $derived(
    scores1.map((s1, i) => {
      const s2 = scores2[i];
      if (s1 === null || s2 === null) return { valid: false, error: '' };
      if (s1 === s2) return { valid: false, error: 'Egalite interdite' };
      if (!isValidSetScore(s1, s2)) return { valid: false, error: 'Ecart de 2 pts requis (max 30)' };
      return { valid: true, error: '' };
    })
  );

  // Validation globale
  let isValid = $derived(() => {
    // Verifier que tous les sets actifs ont des scores valides
    for (let i = 0; i < nbSets; i++) {
      const s1 = scores1[i];
      const s2 = scores2[i];

      if (s1 === null || s2 === null) return false;
      if (!isValidSetScore(s1, s2)) return false;
    }

    // En mode edition, on ne peut pas changer le vainqueur
    if (wouldChangeWinner) return false;

    return hasWinner;
  });

  /**
   * Handler pour changement score joueur 1
   * Auto-remplit l'autre selon les regles badminton
   */
  function handleScore1Change(setIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value === '' ? null : parseInt(input.value, 10);
    scores1[setIndex] = value;

    // Pas d'auto-fill pour null
    if (value === null) return;

    // Score perdant (< 20) -> l'autre gagne a 21
    if (value < 20) {
      scores2[setIndex] = 21;
    }
    // Score 20-28 -> l'autre = score + 2 (ecart de 2 points)
    else if (value >= 20 && value <= 28) {
      scores2[setIndex] = value + 2;
    }
    // Score 29 -> l'autre = 30 (max)
    else if (value === 29) {
      scores2[setIndex] = 30;
    }
    // Score 30 -> l'autre = 28 (score perdant par defaut)
    else if (value === 30) {
      scores2[setIndex] = 28;
    }
  }

  /**
   * Handler pour changement score joueur 2
   * Auto-remplit l'autre selon les regles badminton
   */
  function handleScore2Change(setIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value === '' ? null : parseInt(input.value, 10);
    scores2[setIndex] = value;

    // Pas d'auto-fill pour null
    if (value === null) return;

    // Score perdant (< 20) -> l'autre gagne a 21
    if (value < 20) {
      scores1[setIndex] = 21;
    }
    // Score 20-28 -> l'autre = score + 2 (ecart de 2 points)
    else if (value >= 20 && value <= 28) {
      scores1[setIndex] = value + 2;
    }
    // Score 29 -> l'autre = 30 (max)
    else if (value === 29) {
      scores1[setIndex] = 30;
    }
    // Score 30 -> l'autre = 28 (score perdant par defaut)
    else if (value === 30) {
      scores1[setIndex] = 28;
    }
  }

  // Ajouter un set
  function addSet() {
    if (nbSets < 3) {
      nbSets++;
    }
  }

  // Reset quand le modal s'ouvre
  $effect(() => {
    if (open) {
      // Charger les scores existants ou reset
      if (match.scoreParticipant1 && match.scoreParticipant1.length > 0) {
        scores1 = [...match.scoreParticipant1, null, null].slice(0, 3) as (number | null)[];
        scores2 = [...(match.scoreParticipant2 ?? []), null, null].slice(0, 3) as (number | null)[];
        nbSets = Math.max(match.scoreParticipant1.length, 2);
      } else {
        scores1 = [null, null, null];
        scores2 = [null, null, null];
        nbSets = 2;
      }
      error = '';
    }
  });

  // Sauvegarder
  async function handleSave() {
    if (!isValid) return;

    saving = true;
    error = '';

    try {
      // Filtrer les scores valides
      const validScores1 = scores1.slice(0, nbSets).filter((s): s is number => s !== null);
      const validScores2 = scores2.slice(0, nbSets).filter((s): s is number => s !== null);

      await convexClient.mutation(
        getFunctionName(api.bracket.saveMatchResult),
        {
          matchId: match._id,
          scoreParticipant1: validScores1,
          scoreParticipant2: validScores2,
        }
      );

      onSave?.();
    } catch (err) {
      console.error('Erreur sauvegarde score:', err);
      error = 'Erreur lors de la sauvegarde du score';
    } finally {
      saving = false;
    }
  }

  function handleClose() {
    open = false;
  }
</script>

<Modal bind:open title={isEditMode ? "Modifier le score" : "Saisir le score"} size="default">
  <div class="space-y-6">
    <!-- Header avec les noms -->
    <div class="grid grid-cols-5 gap-2 items-center text-center">
      <div class="col-span-2">
        <p class="font-semibold text-text-primary truncate">{participant1Name}</p>
        <p class="text-sm text-text-muted">{setsWon1} set{setsWon1 !== 1 ? 's' : ''}</p>
      </div>
      <div class="text-text-muted text-sm">VS</div>
      <div class="col-span-2">
        <p class="font-semibold text-text-primary truncate">{participant2Name}</p>
        <p class="text-sm text-text-muted">{setsWon2} set{setsWon2 !== 1 ? 's' : ''}</p>
      </div>
    </div>

    <!-- Sets -->
    <div class="space-y-3">
      {#each { length: nbSets } as _, setIndex}
        <div class="space-y-1">
          <div class="grid grid-cols-5 gap-2 items-center">
            <div class="col-span-2">
              <input
                type="number"
                min="0"
                max="30"
                placeholder="0"
                value={scores1[setIndex] ?? ''}
                onchange={(e) => handleScore1Change(setIndex, e)}
                class="w-full text-center bg-white border rounded-lg px-3 py-2 text-lg font-semibold
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
                  {setValidation[setIndex]?.error ? 'border-danger' : 'border-border'}"
              />
            </div>
            <div class="text-center text-sm text-text-muted font-medium">
              Set {setIndex + 1}
            </div>
            <div class="col-span-2">
              <input
                type="number"
                min="0"
                max="30"
                placeholder="0"
                value={scores2[setIndex] ?? ''}
                onchange={(e) => handleScore2Change(setIndex, e)}
                class="w-full text-center bg-white border rounded-lg px-3 py-2 text-lg font-semibold
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
                  {setValidation[setIndex]?.error ? 'border-danger' : 'border-border'}"
              />
            </div>
          </div>
          {#if setValidation[setIndex]?.error}
            <p class="text-xs text-danger text-center">{setValidation[setIndex].error}</p>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Ajouter set 3 -->
    {#if nbSets < 3 && !hasWinner}
      <button
        type="button"
        onclick={addSet}
        class="w-full py-2 text-sm text-accent hover:text-accent-hover transition-colors"
      >
        + Ajouter le set 3
      </button>
    {/if}

    <!-- Avertissement changement vainqueur -->
    {#if wouldChangeWinner}
      <div class="p-3 bg-danger/10 border border-danger/20 rounded-lg text-center">
        <p class="text-sm text-danger font-medium">
          Impossible de changer le vainqueur d'un match termine
        </p>
      </div>
    {:else if hasWinner}
      <!-- Indicateur du vainqueur -->
      <div class="p-3 bg-success/10 border border-success/20 rounded-lg text-center">
        <p class="text-sm text-success font-medium">
          Vainqueur: {winnerName}
        </p>
      </div>
    {/if}

    <!-- Erreur -->
    {#if error}
      <div class="p-3 bg-danger/10 border border-danger/20 rounded-lg text-center">
        <p class="text-sm text-danger">{error}</p>
      </div>
    {/if}

    <!-- Regles -->
    <p class="text-xs text-text-muted text-center">
      Match en 2 sets gagnants sur 3. Set a 21 points, ecart de 2 requis (max 30).
    </p>
  </div>

  {#snippet footer()}
    <Button variant="secondary" onclick={handleClose} disabled={saving}>
      Annuler
    </Button>
    <Button onclick={handleSave} disabled={!isValid || saving}>
      {#if saving}
        Sauvegarde...
      {:else if isEditMode}
        Modifier le score
      {:else}
        Valider le score
      {/if}
    </Button>
  {/snippet}
</Modal>
