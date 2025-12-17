import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import type { Id, Doc } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// ============================================
// Helper functions
// ============================================

/**
 * Valide un score de set selon les regles du badminton
 * - Le gagnant doit avoir au moins 21 points
 * - Le gagnant doit avoir au moins 2 points d'avance (sauf a 30-29)
 * - Maximum 30 points
 */
function isValidBadmintonSetScore(score1: number, score2: number): boolean {
  const winner = Math.max(score1, score2);
  const loser = Math.min(score1, score2);

  // Scores negatifs interdits
  if (winner < 0 || loser < 0) return false;

  // Le gagnant doit avoir au moins 21 points
  if (winner < 21) return false;

  // Maximum 30 points
  if (winner > 30) return false;

  // A 30 points, pas besoin d'ecart de 2
  if (winner === 30) return true;

  // Sinon, ecart de 2 requis
  return winner - loser >= 2;
}

/**
 * Valide tous les sets d'un match
 */
function validateBadmintonScores(scores1: number[], scores2: number[]): { valid: boolean; error?: string } {
  if (scores1.length !== scores2.length) {
    return { valid: false, error: "Les deux tableaux de scores doivent avoir la meme longueur" };
  }

  if (scores1.length < 2 || scores1.length > 3) {
    return { valid: false, error: "Un match doit avoir 2 ou 3 sets" };
  }

  for (let i = 0; i < scores1.length; i++) {
    if (!isValidBadmintonSetScore(scores1[i], scores2[i])) {
      return {
        valid: false,
        error: `Set ${i + 1} invalide (${scores1[i]}-${scores2[i]}). Un set doit se terminer a 21 avec 2 points d'ecart (max 30).`
      };
    }
  }

  return { valid: true };
}

/**
 * Calcule la plus petite puissance de 2 >= n
 */
function nextPowerOf2(n: number): number {
  let power = 1;
  while (power < n) {
    power *= 2;
  }
  return power;
}

/**
 * Calcule le nombre de rounds pour un bracket de taille donnee
 */
function getNumberOfRounds(bracketSize: number): number {
  return Math.log2(bracketSize);
}

/**
 * Genere l'ordre de seeding standard pour un bracket
 * Ex pour 8 joueurs: [1,8,4,5,2,7,3,6] -> Match1: 1v8, Match2: 4v5, etc.
 * Cela garantit que les meilleurs seeds se rencontrent en finale
 */
function generateSeedOrder(bracketSize: number): number[] {
  if (bracketSize === 1) return [1];
  if (bracketSize === 2) return [1, 2];

  const halfSize = bracketSize / 2;
  const topHalf = generateSeedOrder(halfSize);
  const bottomHalf: number[] = [];

  // Pour chaque seed du haut, on ajoute son complementaire
  for (const seed of topHalf) {
    bottomHalf.push(bracketSize + 1 - seed);
  }

  // Entrelacer: [top[0], bottom[0], top[1], bottom[1], ...]
  const result: number[] = [];
  for (let i = 0; i < halfSize; i++) {
    result.push(topHalf[i]);
    result.push(bottomHalf[i]);
  }

  return result;
}

/**
 * Melange un tableau (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ============================================
// Mutations
// ============================================

/**
 * Lance un tournoi: genere le bracket et passe en status "in_progress"
 * Supporte les tournois single (1v1), double (2v2) et mixed (H+F)
 */
export const startTournament = mutation({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, args) => {
    // 1. Recuperer le tournoi
    const tournament = await ctx.db.get(args.tournamentId);
    if (!tournament) {
      throw new Error("Tournoi introuvable");
    }

    if (tournament.status !== "draft") {
      throw new Error("Le tournoi doit etre en brouillon pour etre lance");
    }

    const isTeamTournament = tournament.tournamentType === "double" || tournament.tournamentType === "mixed";

    // 2. Recuperer les participants
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_tournament", (q: any) => q.eq("tournamentId", args.tournamentId))
      .collect();

    if (participants.length < 2) {
      throw new Error("Il faut au moins 2 participants pour lancer un tournoi");
    }

    // Pour les tournois d'equipes, on travaille avec des teams
    let teams: Doc<"teams">[] = [];

    if (isTeamTournament) {
      // Verifications specifiques aux tournois d'equipes
      if (participants.length % 2 !== 0) {
        throw new Error("Il faut un nombre pair de participants pour un tournoi en double ou mixte");
      }

      if (tournament.tournamentType === "mixed") {
        // Verifier que tous les participants ont un genre
        const withoutGender = participants.filter(p => !p.gender);
        if (withoutGender.length > 0) {
          throw new Error(`${withoutGender.length} participant(s) n'ont pas de genre defini. Tous les participants doivent avoir un genre pour un tournoi mixte.`);
        }

        // Verifier la parite hommes/femmes
        const males = participants.filter(p => p.gender === "M");
        const females = participants.filter(p => p.gender === "F");
        if (males.length !== females.length) {
          throw new Error(`Repartition inegale: ${males.length} hommes, ${females.length} femmes. Un tournoi mixte requiert un nombre egal d'hommes et de femmes.`);
        }
      }

      // Generer les equipes automatiquement
      // Supprimer les equipes existantes
      const existingTeams = await ctx.db
        .query("teams")
        .withIndex("by_tournament", (q: any) => q.eq("tournamentId", args.tournamentId))
        .collect();

      for (const team of existingTeams) {
        await ctx.db.delete(team._id);
      }

      // Creer les nouvelles equipes
      if (tournament.tournamentType === "double") {
        // Double: paires aleatoires
        const shuffled = shuffleArray(participants);
        for (let i = 0; i < shuffled.length; i += 2) {
          const teamId = await ctx.db.insert("teams", {
            tournamentId: args.tournamentId,
            player1Id: shuffled[i]._id,
            player2Id: shuffled[i + 1]._id,
          });
          const team = await ctx.db.get(teamId);
          if (team) teams.push(team);
        }
      } else {
        // Mixed: 1H + 1F par equipe
        const males = shuffleArray(participants.filter(p => p.gender === "M"));
        const females = shuffleArray(participants.filter(p => p.gender === "F"));

        for (let i = 0; i < males.length; i++) {
          const teamId = await ctx.db.insert("teams", {
            tournamentId: args.tournamentId,
            player1Id: males[i]._id,
            player2Id: females[i]._id,
          });
          const team = await ctx.db.get(teamId);
          if (team) teams.push(team);
        }
      }
    }

    // 3. Calculer la taille du bracket
    const entitiesCount = isTeamTournament ? teams.length : participants.length;
    const bracketSize = nextPowerOf2(entitiesCount);
    const nbRounds = getNumberOfRounds(bracketSize);

    // 4. Appliquer le seeding
    const seedingMethod = tournament.settings?.seedingMethod || "random";

    let seededEntities: (Doc<"participants"> | Doc<"teams"> | null)[];

    if (isTeamTournament) {
      if (seedingMethod === "random") {
        seededEntities = shuffleArray(teams);
      } else {
        seededEntities = [...teams].sort((a, b) => {
          const seedA = a.seed ?? Infinity;
          const seedB = b.seed ?? Infinity;
          return seedA - seedB;
        });
      }
    } else {
      if (seedingMethod === "random") {
        seededEntities = shuffleArray(participants);
      } else {
        seededEntities = [...participants].sort((a, b) => {
          const seedA = a.seed ?? Infinity;
          const seedB = b.seed ?? Infinity;
          return seedA - seedB;
        });
      }
    }

    // 5. Placer dans l'ordre du bracket avec les BYEs
    const seedOrder = generateSeedOrder(bracketSize);
    const bracketSlots: (Doc<"participants"> | Doc<"teams"> | null)[] = new Array(bracketSize).fill(null);

    for (let i = 0; i < bracketSize; i++) {
      const seedPosition = seedOrder[i] - 1; // seedOrder est 1-indexed
      if (seedPosition < seededEntities.length) {
        bracketSlots[i] = seededEntities[seedPosition];
      } else {
        bracketSlots[i] = null; // BYE
      }
    }

    // 6. Generer les matchs du premier tour
    const matchIds: Id<"matches">[] = [];
    const firstRoundMatchCount = bracketSize / 2;

    for (let matchNum = 1; matchNum <= firstRoundMatchCount; matchNum++) {
      const idx1 = (matchNum - 1) * 2;
      const idx2 = idx1 + 1;
      const e1 = bracketSlots[idx1];
      const e2 = bracketSlots[idx2];

      // Determiner si c'est un BYE
      const isBye = e1 === null || e2 === null;
      const realEntity = e1 || e2;

      const matchData: any = {
        tournamentId: args.tournamentId,
        round: 1,
        matchNumber: matchNum,
        phase: "elimination",
        status: isBye ? "walkover" : "pending",
        validated: isBye,
      };

      if (isTeamTournament) {
        matchData.team1Id = e1?._id;
        matchData.team2Id = e2?._id;
        matchData.winnerId = isBye && realEntity ? realEntity._id : undefined;
      } else {
        matchData.participant1Id = e1?._id;
        matchData.participant2Id = e2?._id;
        matchData.winnerId = isBye && realEntity ? realEntity._id : undefined;
      }

      const matchId = await ctx.db.insert("matches", matchData);
      matchIds.push(matchId);
    }

    // 7. Generer les matchs des tours suivants (vides)
    for (let round = 2; round <= nbRounds; round++) {
      const matchesInRound = bracketSize / Math.pow(2, round);

      for (let matchNum = 1; matchNum <= matchesInRound; matchNum++) {
        const matchId = await ctx.db.insert("matches", {
          tournamentId: args.tournamentId,
          round,
          matchNumber: matchNum,
          phase: round === nbRounds ? "final" : "elimination",
          status: "pending",
          validated: false,
        });

        matchIds.push(matchId);
      }
    }

    // 8. Propager les vainqueurs des BYEs au tour suivant
    const firstRoundMatches = await ctx.db
      .query("matches")
      .withIndex("by_tournament", (q: any) => q.eq("tournamentId", args.tournamentId))
      .filter((q) => q.eq(q.field("round"), 1))
      .collect();

    for (const match of firstRoundMatches) {
      if (match.status === "walkover" && match.winnerId) {
        await propagateWinnerInternal(ctx, match);
      }
    }

    // 9. Mettre a jour le statut du tournoi
    await ctx.db.patch(args.tournamentId, { status: "in_progress" });

    return {
      success: true,
      matchCount: matchIds.length,
      teamCount: isTeamTournament ? teams.length : 0
    };
  },
});

/**
 * Fonction interne pour propager un vainqueur au match suivant
 * Supporte les matchs individuels et les matchs d'equipes
 */
async function propagateWinnerInternal(
  ctx: { db: any },
  match: Doc<"matches">
) {
  if (!match.winnerId) return;

  const nextRound = match.round + 1;
  const nextMatchNumber = Math.ceil(match.matchNumber / 2);

  // Determiner si c'est un match d'equipes
  const isTeamMatch = match.team1Id || match.team2Id;

  // Le slot depend du type de match
  const slotNumber = match.matchNumber % 2 === 1 ? 1 : 2;
  const slot = isTeamMatch
    ? (slotNumber === 1 ? "team1Id" : "team2Id")
    : (slotNumber === 1 ? "participant1Id" : "participant2Id");

  // Trouver le match suivant
  const tournamentMatches = await ctx.db
    .query("matches")
    .withIndex("by_tournament", (q: any) => q.eq("tournamentId", match.tournamentId))
    .collect();

  const nextMatch = tournamentMatches.find(
    (m: any) => m.round === nextRound && m.matchNumber === nextMatchNumber
  );

  if (nextMatch) {
    await ctx.db.patch(nextMatch._id, { [slot]: match.winnerId });
  }
}

/**
 * Sauvegarde le score d'un match et propage le vainqueur
 * Supporte les matchs individuels (participants) et les matchs d'equipes (teams)
 */
export const saveMatchResult = mutation({
  args: {
    matchId: v.id("matches"),
    scoreParticipant1: v.array(v.number()),
    scoreParticipant2: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) {
      throw new Error("Match introuvable");
    }

    // Determiner si c'est un match de teams ou de participants
    const isTeamMatch = match.team1Id && match.team2Id;
    const hasParticipants = match.participant1Id && match.participant2Id;

    if (!isTeamMatch && !hasParticipants) {
      throw new Error("Les deux participants ou equipes doivent etre definis");
    }

    // Valider les scores selon les regles du badminton
    const validation = validateBadmintonScores(args.scoreParticipant1, args.scoreParticipant2);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Calculer le vainqueur (2 sets gagnants sur 3)
    let setsWon1 = 0;
    let setsWon2 = 0;

    for (let i = 0; i < args.scoreParticipant1.length; i++) {
      const s1 = args.scoreParticipant1[i];
      const s2 = args.scoreParticipant2[i];

      if (s1 > s2) {
        setsWon1++;
      } else if (s2 > s1) {
        setsWon2++;
      }
    }

    if (setsWon1 < 2 && setsWon2 < 2) {
      throw new Error("Un joueur/equipe doit gagner au moins 2 sets");
    }

    // Determiner le winnerId selon le type de match
    let winnerId: string;
    if (isTeamMatch) {
      winnerId = setsWon1 >= 2 ? match.team1Id! : match.team2Id!;
    } else {
      winnerId = setsWon1 >= 2 ? match.participant1Id! : match.participant2Id!;
    }

    // Mettre a jour le match
    await ctx.db.patch(args.matchId, {
      scoreParticipant1: args.scoreParticipant1,
      scoreParticipant2: args.scoreParticipant2,
      winnerId,
      status: "finished",
      validated: true,
    });

    // Propager le vainqueur
    const updatedMatch = await ctx.db.get(args.matchId);
    if (updatedMatch) {
      await propagateWinnerInternal(ctx, updatedMatch);
    }

    // Note: Le statut du tournoi est mis a jour manuellement via finalizeTournament

    return { success: true, winnerId };
  },
});

// ============================================
// Queries
// ============================================

/**
 * Recupere le bracket complet d'un tournoi
 * Supporte les tournois individuels et d'equipes
 */
export const getBracket = query({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, args) => {
    // Recuperer le tournoi pour connaitre le type
    const tournament = await ctx.db.get(args.tournamentId);
    if (!tournament) return null;

    const isTeamTournament = tournament.tournamentType === "double" || tournament.tournamentType === "mixed";

    // Recuperer tous les matchs
    const matches = await ctx.db
      .query("matches")
      .withIndex("by_tournament", (q: any) => q.eq("tournamentId", args.tournamentId))
      .collect();

    if (matches.length === 0) {
      return null;
    }

    // Recuperer tous les participants
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_tournament", (q: any) => q.eq("tournamentId", args.tournamentId))
      .collect();

    // Creer un map des participants
    const participantMap = new Map<string, Doc<"participants">>();
    for (const p of participants) {
      participantMap.set(p._id, p);
    }

    // Recuperer les equipes si c'est un tournoi d'equipes
    let teamMap = new Map<string, { team: Doc<"teams">; player1: Doc<"participants"> | null; player2: Doc<"participants"> | null }>();

    if (isTeamTournament) {
      const teams = await ctx.db
        .query("teams")
        .withIndex("by_tournament", (q: any) => q.eq("tournamentId", args.tournamentId))
        .collect();

      for (const team of teams) {
        const player1 = await ctx.db.get(team.player1Id);
        const player2 = await ctx.db.get(team.player2Id);
        teamMap.set(team._id, { team, player1, player2 });
      }
    }

    // Grouper les matchs par round
    const maxRound = Math.max(...matches.map((m) => m.round));
    const rounds: typeof matches[] = [];

    for (let round = 1; round <= maxRound; round++) {
      const roundMatches = matches
        .filter((m) => m.round === round)
        .sort((a, b) => a.matchNumber - b.matchNumber);
      rounds.push(roundMatches);
    }

    // Enrichir les matchs avec les infos des participants ou equipes
    const enrichedRounds = rounds.map((round) =>
      round.map((match) => {
        if (isTeamTournament) {
          const team1Data = match.team1Id ? teamMap.get(match.team1Id) : undefined;
          const team2Data = match.team2Id ? teamMap.get(match.team2Id) : undefined;

          return {
            ...match,
            // Pour compatibilite, on expose aussi participant1/2 mais avec les infos d'equipe
            team1: team1Data?.team,
            team2: team2Data?.team,
            team1Player1: team1Data?.player1,
            team1Player2: team1Data?.player2,
            team2Player1: team2Data?.player1,
            team2Player2: team2Data?.player2,
            // Alias pour affichage: "Prenom1 / Prenom2"
            participant1DisplayName: team1Data
              ? `${team1Data.player1?.firstName || '?'} / ${team1Data.player2?.firstName || '?'}`
              : undefined,
            participant2DisplayName: team2Data
              ? `${team2Data.player1?.firstName || '?'} / ${team2Data.player2?.firstName || '?'}`
              : undefined,
          };
        } else {
          const p1 = match.participant1Id ? participantMap.get(match.participant1Id) : undefined;
          const p2 = match.participant2Id ? participantMap.get(match.participant2Id) : undefined;

          return {
            ...match,
            participant1: p1,
            participant2: p2,
            participant1DisplayName: p1 ? `${p1.firstName} ${p1.lastName}` : undefined,
            participant2DisplayName: p2 ? `${p2.firstName} ${p2.lastName}` : undefined,
          };
        }
      })
    );

    return {
      rounds: enrichedRounds,
      totalRounds: maxRound,
      participantCount: participants.length,
      isTeamTournament,
      teamCount: isTeamTournament ? teamMap.size : 0,
    };
  },
});

/**
 * Recupere un match specifique avec les infos des participants ou equipes
 */
export const getMatch = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) return null;

    // Recuperer le tournoi pour determiner le type
    const tournament = await ctx.db.get(match.tournamentId);
    const isTeamMatch = match.team1Id || match.team2Id;

    if (isTeamMatch) {
      // Charger les equipes et leurs joueurs
      const team1 = match.team1Id ? await ctx.db.get(match.team1Id) : null;
      const team2 = match.team2Id ? await ctx.db.get(match.team2Id) : null;

      const team1Player1 = team1?.player1Id ? await ctx.db.get(team1.player1Id) : null;
      const team1Player2 = team1?.player2Id ? await ctx.db.get(team1.player2Id) : null;
      const team2Player1 = team2?.player1Id ? await ctx.db.get(team2.player1Id) : null;
      const team2Player2 = team2?.player2Id ? await ctx.db.get(team2.player2Id) : null;

      return {
        ...match,
        team1,
        team2,
        team1Player1,
        team1Player2,
        team2Player1,
        team2Player2,
        participant1DisplayName: team1 && team1Player1 && team1Player2
          ? `${team1Player1.firstName} / ${team1Player2.firstName}`
          : undefined,
        participant2DisplayName: team2 && team2Player1 && team2Player2
          ? `${team2Player1.firstName} / ${team2Player2.firstName}`
          : undefined,
        isTeamMatch: true,
      };
    } else {
      const participant1 = match.participant1Id
        ? await ctx.db.get(match.participant1Id)
        : null;
      const participant2 = match.participant2Id
        ? await ctx.db.get(match.participant2Id)
        : null;

      return {
        ...match,
        participant1,
        participant2,
        participant1DisplayName: participant1
          ? `${participant1.firstName} ${participant1.lastName}`
          : undefined,
        participant2DisplayName: participant2
          ? `${participant2.firstName} ${participant2.lastName}`
          : undefined,
        isTeamMatch: false,
      };
    }
  },
});

/**
 * Cloture manuellement un tournoi
 */
export const finalizeTournament = mutation({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, args) => {
    const tournament = await ctx.db.get(args.tournamentId);
    if (!tournament) {
      throw new Error("Tournoi introuvable");
    }

    if (tournament.status === "finished") {
      return { success: true, message: "Tournoi deja cloture" };
    }

    if (tournament.status !== "in_progress") {
      throw new Error("Le tournoi doit etre en cours pour etre cloture");
    }

    // Verifier que la finale est terminee
    const matches = await ctx.db
      .query("matches")
      .withIndex("by_tournament", (q: any) => q.eq("tournamentId", args.tournamentId))
      .collect();

    const finalMatch = matches.find((m) => m.phase === "final");
    if (!finalMatch || finalMatch.status !== "finished") {
      throw new Error("La finale doit etre terminee pour cloturer le tournoi");
    }

    // Mettre a jour le statut
    await ctx.db.patch(args.tournamentId, { status: "finished" });

    return { success: true, winnerId: finalMatch.winnerId };
  },
});
