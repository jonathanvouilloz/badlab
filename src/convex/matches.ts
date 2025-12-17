import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all matches for a tournament
export const getByTournament = query({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("matches")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .collect();
  },
});

// Get matches by pool
export const getByPool = query({
  args: { poolId: v.id("pools") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("matches")
      .withIndex("by_pool", (q) => q.eq("poolId", args.poolId))
      .collect();
  },
});

// Get matches by round
export const getByRound = query({
  args: {
    tournamentId: v.id("tournaments"),
    round: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("matches")
      .withIndex("by_tournament_round", (q) =>
        q.eq("tournamentId", args.tournamentId).eq("round", args.round)
      )
      .collect();
  },
});

// Get a single match
export const getById = query({
  args: { id: v.id("matches") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get pending matches for a tournament
export const getPending = query({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("matches")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});

// Create a match
export const create = mutation({
  args: {
    tournamentId: v.id("tournaments"),
    round: v.number(),
    matchNumber: v.number(),
    phase: v.optional(v.union(
      v.literal("pool"),
      v.literal("elimination"),
      v.literal("final")
    )),
    poolId: v.optional(v.id("pools")),
    court: v.optional(v.number()),
    scheduledTime: v.optional(v.string()),
    participant1Id: v.optional(v.id("participants")),
    participant2Id: v.optional(v.id("participants")),
    team1Id: v.optional(v.id("teams")),
    team2Id: v.optional(v.id("teams")),
  },
  handler: async (ctx, args) => {
    const matchId = await ctx.db.insert("matches", {
      ...args,
      status: "pending",
      validated: false,
    });
    return matchId;
  },
});

// Update match score
export const updateScore = mutation({
  args: {
    id: v.id("matches"),
    scoreParticipant1: v.array(v.number()),
    scoreParticipant2: v.array(v.number()),
    enteredBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.id);
    if (!match) throw new Error("Match not found");

    // Calculate winner based on sets won
    let sets1 = 0;
    let sets2 = 0;

    for (let i = 0; i < args.scoreParticipant1.length; i++) {
      if (args.scoreParticipant1[i] > args.scoreParticipant2[i]) {
        sets1++;
      } else {
        sets2++;
      }
    }

    // Determine winner (best of 3)
    let winnerId: string | undefined;
    let status: "pending" | "in_progress" | "finished" | "walkover" | "disqualified" = "in_progress";

    if (sets1 >= 2 || sets2 >= 2) {
      status = "finished";
      if (sets1 > sets2) {
        winnerId = match.participant1Id ?? match.team1Id;
      } else {
        winnerId = match.participant2Id ?? match.team2Id;
      }
    }

    await ctx.db.patch(args.id, {
      scoreParticipant1: args.scoreParticipant1,
      scoreParticipant2: args.scoreParticipant2,
      winnerId,
      status,
      enteredBy: args.enteredBy,
    });

    return args.id;
  },
});

// Set match as walkover
export const setWalkover = mutation({
  args: {
    id: v.id("matches"),
    winnerId: v.string(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      winnerId: args.winnerId,
      status: "walkover",
      comment: args.comment,
    });
    return args.id;
  },
});

// Validate match result
export const validate = mutation({
  args: { id: v.id("matches") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { validated: true });
    return args.id;
  },
});

// Update match status
export const updateStatus = mutation({
  args: {
    id: v.id("matches"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("finished"),
      v.literal("walkover"),
      v.literal("disqualified")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return args.id;
  },
});

// Update match scheduling
export const updateSchedule = mutation({
  args: {
    id: v.id("matches"),
    court: v.optional(v.number()),
    scheduledTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete match
export const remove = mutation({
  args: { id: v.id("matches") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Bulk create matches (for bracket generation)
export const bulkCreate = mutation({
  args: {
    matches: v.array(v.object({
      tournamentId: v.id("tournaments"),
      round: v.number(),
      matchNumber: v.number(),
      phase: v.optional(v.union(
        v.literal("pool"),
        v.literal("elimination"),
        v.literal("final")
      )),
      poolId: v.optional(v.id("pools")),
      participant1Id: v.optional(v.id("participants")),
      participant2Id: v.optional(v.id("participants")),
      team1Id: v.optional(v.id("teams")),
      team2Id: v.optional(v.id("teams")),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const match of args.matches) {
      const id = await ctx.db.insert("matches", {
        ...match,
        status: "pending",
        validated: false,
      });
      ids.push(id);
    }
    return ids;
  },
});
