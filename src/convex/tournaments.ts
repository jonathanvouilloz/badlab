import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

// Get all tournaments for an organizer
export const getByOrganizer = query({
  args: { organizerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tournaments")
      .withIndex("by_organizer", (q) => q.eq("organizerId", args.organizerId))
      .order("desc")
      .collect();
  },
});

// Get a single tournament by ID
export const getById = query({
  args: { id: v.id("tournaments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get tournaments by status
export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("draft"),
      v.literal("registration_open"),
      v.literal("in_progress"),
      v.literal("finished")
    )
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tournaments")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Get all public tournaments (for listing)
export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tournaments")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "registration_open"),
          q.eq(q.field("status"), "in_progress")
        )
      )
      .order("desc")
      .collect();
  },
});

// Create a new tournament
export const create = mutation({
  args: {
    organizerId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    startTime: v.optional(v.string()),
    format: v.union(
      v.literal("elimination"),
      v.literal("pools_elimination"),
      v.literal("round_robin"),
      v.literal("swiss")
    ),
    tournamentType: v.union(
      v.literal("single"),
      v.literal("double"),
      v.literal("mixed")
    ),
    inscriptionType: v.union(
      v.literal("closed"),
      v.literal("open")
    ),
    inscriptionDeadline: v.optional(v.string()),
    maxParticipants: v.optional(v.number()),
    nbCourts: v.optional(v.number()),
    matchDuration: v.optional(v.number()),
    settings: v.optional(v.object({
      nbPools: v.optional(v.number()),
      playersPerPool: v.optional(v.number()),
      qualifiedPerPool: v.optional(v.number()),
      seedingMethod: v.optional(v.union(
        v.literal("auto"),
        v.literal("manual"),
        v.literal("random")
      )),
    })),
  },
  handler: async (ctx, args) => {
    const tournamentId = await ctx.db.insert("tournaments", {
      ...args,
      status: "draft",
    });
    return tournamentId;
  },
});

// Update tournament
export const update = mutation({
  args: {
    id: v.id("tournaments"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    startTime: v.optional(v.string()),
    format: v.optional(v.union(
      v.literal("elimination"),
      v.literal("pools_elimination"),
      v.literal("round_robin"),
      v.literal("swiss")
    )),
    tournamentType: v.optional(v.union(
      v.literal("single"),
      v.literal("double"),
      v.literal("mixed")
    )),
    inscriptionType: v.optional(v.union(
      v.literal("closed"),
      v.literal("open")
    )),
    inscriptionDeadline: v.optional(v.string()),
    maxParticipants: v.optional(v.number()),
    nbCourts: v.optional(v.number()),
    matchDuration: v.optional(v.number()),
    settings: v.optional(v.object({
      nbPools: v.optional(v.number()),
      playersPerPool: v.optional(v.number()),
      qualifiedPerPool: v.optional(v.number()),
      seedingMethod: v.optional(v.union(
        v.literal("auto"),
        v.literal("manual"),
        v.literal("random")
      )),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
    return id;
  },
});

// Update tournament status
export const updateStatus = mutation({
  args: {
    id: v.id("tournaments"),
    status: v.union(
      v.literal("draft"),
      v.literal("registration_open"),
      v.literal("in_progress"),
      v.literal("finished")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return args.id;
  },
});

// Delete tournament
export const remove = mutation({
  args: { id: v.id("tournaments") },
  handler: async (ctx, args) => {
    // Delete related data first
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.id))
      .collect();

    for (const p of participants) {
      await ctx.db.delete(p._id);
    }

    const matches = await ctx.db
      .query("matches")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.id))
      .collect();

    for (const m of matches) {
      await ctx.db.delete(m._id);
    }

    const pools = await ctx.db
      .query("pools")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.id))
      .collect();

    for (const pool of pools) {
      // Delete pool standings
      const standings = await ctx.db
        .query("poolStandings")
        .withIndex("by_pool", (q) => q.eq("poolId", pool._id))
        .collect();

      for (const s of standings) {
        await ctx.db.delete(s._id);
      }

      await ctx.db.delete(pool._id);
    }

    const teams = await ctx.db
      .query("teams")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.id))
      .collect();

    for (const t of teams) {
      await ctx.db.delete(t._id);
    }

    // Finally delete the tournament
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Duplicate tournament
export const duplicate = mutation({
  args: {
    id: v.id("tournaments"),
    newName: v.string(),
    newStartDate: v.string(),
  },
  handler: async (ctx, args) => {
    const original = await ctx.db.get(args.id);
    if (!original) throw new Error("Tournament not found");

    const { _id, _creationTime, ...tournamentData } = original;

    const newTournamentId = await ctx.db.insert("tournaments", {
      ...tournamentData,
      name: args.newName,
      startDate: args.newStartDate,
      status: "draft",
    });

    return newTournamentId;
  },
});

// ============================================
// Queries pour le Dashboard
// ============================================

// Get tournaments for current authenticated user (as organizer)
export const getMyTournaments = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return [];

    const appUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .first();

    if (!appUser) return [];

    return await ctx.db
      .query("tournaments")
      .withIndex("by_organizer", (q) => q.eq("organizerId", appUser._id))
      .order("desc")
      .collect();
  },
});

// Get organizer stats for dashboard
export const getOrganizerStats = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return null;

    const appUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .first();

    if (!appUser) return null;

    const tournaments = await ctx.db
      .query("tournaments")
      .withIndex("by_organizer", (q) => q.eq("organizerId", appUser._id))
      .collect();

    const activeTournaments = tournaments.filter(
      (t) => t.status === "registration_open" || t.status === "in_progress"
    );

    // Count total participants across all tournaments
    let totalParticipants = 0;
    for (const tournament of tournaments) {
      const participants = await ctx.db
        .query("participants")
        .withIndex("by_tournament", (q) => q.eq("tournamentId", tournament._id))
        .collect();
      totalParticipants += participants.length;
    }

    return {
      totalTournaments: tournaments.length,
      activeTournaments: activeTournaments.length,
      totalParticipants,
    };
  },
});
