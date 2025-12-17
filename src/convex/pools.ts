import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all pools for a tournament
export const getByTournament = query({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pools")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .collect();
  },
});

// Get a single pool
export const getById = query({
  args: { id: v.id("pools") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a pool
export const create = mutation({
  args: {
    tournamentId: v.id("tournaments"),
    poolName: v.string(),
    poolNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const poolId = await ctx.db.insert("pools", args);
    return poolId;
  },
});

// Bulk create pools
export const bulkCreate = mutation({
  args: {
    tournamentId: v.id("tournaments"),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const poolNames = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const ids = [];

    for (let i = 0; i < args.count; i++) {
      const id = await ctx.db.insert("pools", {
        tournamentId: args.tournamentId,
        poolName: `Poule ${poolNames[i] || i + 1}`,
        poolNumber: i + 1,
      });
      ids.push(id);
    }

    return ids;
  },
});

// Delete pool
export const remove = mutation({
  args: { id: v.id("pools") },
  handler: async (ctx, args) => {
    // Remove pool assignments from participants
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_pool", (q) => q.eq("poolId", args.id))
      .collect();

    for (const p of participants) {
      await ctx.db.patch(p._id, { poolId: undefined });
    }

    // Delete pool standings
    const standings = await ctx.db
      .query("poolStandings")
      .withIndex("by_pool", (q) => q.eq("poolId", args.id))
      .collect();

    for (const s of standings) {
      await ctx.db.delete(s._id);
    }

    // Delete pool matches
    const matches = await ctx.db
      .query("matches")
      .withIndex("by_pool", (q) => q.eq("poolId", args.id))
      .collect();

    for (const m of matches) {
      await ctx.db.delete(m._id);
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get pool standings
export const getStandings = query({
  args: { poolId: v.id("pools") },
  handler: async (ctx, args) => {
    const standings = await ctx.db
      .query("poolStandings")
      .withIndex("by_pool", (q) => q.eq("poolId", args.poolId))
      .collect();

    // Sort by position or calculate ranking
    return standings.sort((a, b) => {
      // Sort by wins, then by set difference, then by point difference
      if (a.matchesWon !== b.matchesWon) return b.matchesWon - a.matchesWon;
      const aSetDiff = a.setsWon - a.setsLost;
      const bSetDiff = b.setsWon - b.setsLost;
      if (aSetDiff !== bSetDiff) return bSetDiff - aSetDiff;
      const aPointDiff = a.pointsScored - a.pointsConceded;
      const bPointDiff = b.pointsScored - b.pointsConceded;
      return bPointDiff - aPointDiff;
    });
  },
});

// Initialize pool standings for participants
export const initializeStandings = mutation({
  args: { poolId: v.id("pools") },
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_pool", (q) => q.eq("poolId", args.poolId))
      .collect();

    const ids = [];
    for (const participant of participants) {
      const id = await ctx.db.insert("poolStandings", {
        poolId: args.poolId,
        participantId: participant._id,
        matchesPlayed: 0,
        matchesWon: 0,
        matchesLost: 0,
        setsWon: 0,
        setsLost: 0,
        pointsScored: 0,
        pointsConceded: 0,
      });
      ids.push(id);
    }

    return ids;
  },
});

// Update pool standing after a match
export const updateStanding = mutation({
  args: {
    poolId: v.id("pools"),
    participantId: v.id("participants"),
    won: v.boolean(),
    setsWon: v.number(),
    setsLost: v.number(),
    pointsScored: v.number(),
    pointsConceded: v.number(),
  },
  handler: async (ctx, args) => {
    const standing = await ctx.db
      .query("poolStandings")
      .withIndex("by_pool", (q) => q.eq("poolId", args.poolId))
      .filter((q) => q.eq(q.field("participantId"), args.participantId))
      .first();

    if (!standing) {
      // Create new standing
      return await ctx.db.insert("poolStandings", {
        poolId: args.poolId,
        participantId: args.participantId,
        matchesPlayed: 1,
        matchesWon: args.won ? 1 : 0,
        matchesLost: args.won ? 0 : 1,
        setsWon: args.setsWon,
        setsLost: args.setsLost,
        pointsScored: args.pointsScored,
        pointsConceded: args.pointsConceded,
      });
    }

    // Update existing standing
    await ctx.db.patch(standing._id, {
      matchesPlayed: standing.matchesPlayed + 1,
      matchesWon: standing.matchesWon + (args.won ? 1 : 0),
      matchesLost: standing.matchesLost + (args.won ? 0 : 1),
      setsWon: standing.setsWon + args.setsWon,
      setsLost: standing.setsLost + args.setsLost,
      pointsScored: standing.pointsScored + args.pointsScored,
      pointsConceded: standing.pointsConceded + args.pointsConceded,
    });

    return standing._id;
  },
});
