import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

// Get all teams for a tournament
export const getByTournament = query({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teams")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .collect();
  },
});

// Get a single team by ID
export const getById = query({
  args: { id: v.id("teams") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get team with participants details
export const getWithParticipants = query({
  args: { id: v.id("teams") },
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.id);
    if (!team) return null;

    const player1 = await ctx.db.get(team.player1Id);
    const player2 = await ctx.db.get(team.player2Id);

    return {
      ...team,
      player1,
      player2,
    };
  },
});

// Get all teams with participants details for a tournament
export const getByTournamentWithParticipants = query({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, args) => {
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .collect();

    return await Promise.all(
      teams.map(async (team) => {
        const player1 = await ctx.db.get(team.player1Id);
        const player2 = await ctx.db.get(team.player2Id);
        return {
          ...team,
          player1,
          player2,
        };
      })
    );
  },
});

// Create a team manually
export const create = mutation({
  args: {
    tournamentId: v.id("tournaments"),
    player1Id: v.id("participants"),
    player2Id: v.id("participants"),
    teamName: v.optional(v.string()),
    seed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Validate tournament exists
    const tournament = await ctx.db.get(args.tournamentId);
    if (!tournament) throw new Error("Tournament not found");

    // Validate players exist and belong to this tournament
    const player1 = await ctx.db.get(args.player1Id);
    const player2 = await ctx.db.get(args.player2Id);

    if (!player1 || player1.tournamentId !== args.tournamentId) {
      throw new Error("Player 1 not found or not in this tournament");
    }
    if (!player2 || player2.tournamentId !== args.tournamentId) {
      throw new Error("Player 2 not found or not in this tournament");
    }

    // For mixed tournaments, validate gender combination
    if (tournament.tournamentType === "mixed") {
      if (!player1.gender || !player2.gender) {
        throw new Error("Both players must have a gender set for mixed tournaments");
      }
      if (player1.gender === player2.gender) {
        throw new Error("Mixed teams must have one male and one female player");
      }
    }

    const teamId = await ctx.db.insert("teams", args);
    return teamId;
  },
});

// Update team
export const update = mutation({
  args: {
    id: v.id("teams"),
    teamName: v.optional(v.string()),
    seed: v.optional(v.number()),
    poolId: v.optional(v.id("pools")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
    return id;
  },
});

// Remove team
export const remove = mutation({
  args: { id: v.id("teams") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Auto-generate teams for double or mixed tournaments
export const autoGenerateTeams = mutation({
  args: {
    tournamentId: v.id("tournaments"),
  },
  handler: async (ctx, args) => {
    // Get tournament
    const tournament = await ctx.db.get(args.tournamentId);
    if (!tournament) throw new Error("Tournament not found");

    if (tournament.tournamentType === "single") {
      throw new Error("Cannot generate teams for single tournaments");
    }

    // Delete existing teams for this tournament
    const existingTeams = await ctx.db
      .query("teams")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .collect();

    for (const team of existingTeams) {
      await ctx.db.delete(team._id);
    }

    // Get all participants
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .collect();

    if (participants.length < 2) {
      throw new Error("Not enough participants to form teams");
    }

    const teamIds: Id<"teams">[] = [];

    if (tournament.tournamentType === "double") {
      // Double: random pairing
      if (participants.length % 2 !== 0) {
        throw new Error("Need an even number of participants for double tournament");
      }

      const shuffled = shuffleArray(participants);

      for (let i = 0; i < shuffled.length; i += 2) {
        const teamId = await ctx.db.insert("teams", {
          tournamentId: args.tournamentId,
          player1Id: shuffled[i]._id,
          player2Id: shuffled[i + 1]._id,
        });
        teamIds.push(teamId);
      }
    } else if (tournament.tournamentType === "mixed") {
      // Mixed: 1 male + 1 female per team
      const males = participants.filter((p) => p.gender === "M");
      const females = participants.filter((p) => p.gender === "F");

      // Check all participants have gender set
      const unassigned = participants.filter((p) => !p.gender);
      if (unassigned.length > 0) {
        throw new Error(
          `${unassigned.length} participant(s) do not have a gender set. All participants must have a gender for mixed tournaments.`
        );
      }

      // Check equal numbers
      if (males.length !== females.length) {
        throw new Error(
          `Unequal gender distribution: ${males.length} males, ${females.length} females. Mixed tournaments require equal numbers.`
        );
      }

      if (males.length === 0) {
        throw new Error("No participants with gender set");
      }

      // Shuffle both groups
      const shuffledMales = shuffleArray(males);
      const shuffledFemales = shuffleArray(females);

      // Pair them up
      for (let i = 0; i < shuffledMales.length; i++) {
        const teamId = await ctx.db.insert("teams", {
          tournamentId: args.tournamentId,
          player1Id: shuffledMales[i]._id,
          player2Id: shuffledFemales[i]._id,
        });
        teamIds.push(teamId);
      }
    }

    return teamIds;
  },
});

// Internal mutation for auto-generating teams (called from bracket.ts)
export const autoGenerateTeamsInternal = internalMutation({
  args: {
    tournamentId: v.id("tournaments"),
  },
  handler: async (ctx, args) => {
    // Get tournament
    const tournament = await ctx.db.get(args.tournamentId);
    if (!tournament) throw new Error("Tournament not found");

    if (tournament.tournamentType === "single") {
      throw new Error("Cannot generate teams for single tournaments");
    }

    // Delete existing teams for this tournament
    const existingTeams = await ctx.db
      .query("teams")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .collect();

    for (const team of existingTeams) {
      await ctx.db.delete(team._id);
    }

    // Get all participants
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .collect();

    if (participants.length < 2) {
      throw new Error("Not enough participants to form teams");
    }

    const teamIds: Id<"teams">[] = [];

    if (tournament.tournamentType === "double") {
      // Double: random pairing
      if (participants.length % 2 !== 0) {
        throw new Error("Need an even number of participants for double tournament");
      }

      const shuffled = shuffleArray(participants);

      for (let i = 0; i < shuffled.length; i += 2) {
        const teamId = await ctx.db.insert("teams", {
          tournamentId: args.tournamentId,
          player1Id: shuffled[i]._id,
          player2Id: shuffled[i + 1]._id,
        });
        teamIds.push(teamId);
      }
    } else if (tournament.tournamentType === "mixed") {
      // Mixed: 1 male + 1 female per team
      const males = participants.filter((p) => p.gender === "M");
      const females = participants.filter((p) => p.gender === "F");

      // Check all participants have gender set
      const unassigned = participants.filter((p) => !p.gender);
      if (unassigned.length > 0) {
        throw new Error(
          `${unassigned.length} participant(s) do not have a gender set. All participants must have a gender for mixed tournaments.`
        );
      }

      // Check equal numbers
      if (males.length !== females.length) {
        throw new Error(
          `Unequal gender distribution: ${males.length} males, ${females.length} females. Mixed tournaments require equal numbers.`
        );
      }

      if (males.length === 0) {
        throw new Error("No participants with gender set");
      }

      // Shuffle both groups
      const shuffledMales = shuffleArray(males);
      const shuffledFemales = shuffleArray(females);

      // Pair them up
      for (let i = 0; i < shuffledMales.length; i++) {
        const teamId = await ctx.db.insert("teams", {
          tournamentId: args.tournamentId,
          player1Id: shuffledMales[i]._id,
          player2Id: shuffledFemales[i]._id,
        });
        teamIds.push(teamId);
      }
    }

    return teamIds;
  },
});

// Get teams by pool
export const getByPool = query({
  args: { poolId: v.id("pools") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teams")
      .withIndex("by_pool", (q) => q.eq("poolId", args.poolId))
      .collect();
  },
});

// Count teams for a tournament
export const countByTournament = query({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, args) => {
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .collect();
    return teams.length;
  },
});
