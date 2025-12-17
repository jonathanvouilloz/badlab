import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

// Get all participants for a tournament
export const getByTournament = query({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("participants")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .collect();
  },
});

// Get participants by pool
export const getByPool = query({
  args: { poolId: v.id("pools") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("participants")
      .withIndex("by_pool", (q) => q.eq("poolId", args.poolId))
      .collect();
  },
});

// Get a single participant by ID
export const getById = query({
  args: { id: v.id("participants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Count participants for a tournament
export const countByTournament = query({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .collect();
    return participants.length;
  },
});

// Add a participant (manual registration by organizer)
export const create = mutation({
  args: {
    tournamentId: v.id("tournaments"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    club: v.optional(v.string()),
    eloRating: v.optional(v.number()),
    level: v.optional(v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("competition")
    )),
    gender: v.optional(v.union(v.literal("M"), v.literal("F"))),
  },
  handler: async (ctx, args) => {
    // Check tournament exists
    const tournament = await ctx.db.get(args.tournamentId);
    if (!tournament) throw new Error("Tournament not found");

    // Check max participants
    if (tournament.maxParticipants) {
      const count = await ctx.db
        .query("participants")
        .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
        .collect();

      if (count.length >= tournament.maxParticipants) {
        throw new Error("Tournament is full");
      }
    }

    const participantId = await ctx.db.insert("participants", args);
    return participantId;
  },
});

// Register (open registration by player)
export const register = mutation({
  args: {
    tournamentId: v.id("tournaments"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    level: v.optional(v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("competition")
    )),
    gender: v.optional(v.union(v.literal("M"), v.literal("F"))),
  },
  handler: async (ctx, args) => {
    // Check tournament exists and is open for registration
    const tournament = await ctx.db.get(args.tournamentId);
    if (!tournament) throw new Error("Tournament not found");

    if (tournament.inscriptionType !== "open") {
      throw new Error("Registration is not open for this tournament");
    }

    if (tournament.status !== "registration_open") {
      throw new Error("Registration is closed");
    }

    // Check deadline
    if (tournament.inscriptionDeadline) {
      const deadline = new Date(tournament.inscriptionDeadline);
      if (new Date() > deadline) {
        throw new Error("Registration deadline has passed");
      }
    }

    // Check max participants
    if (tournament.maxParticipants) {
      const count = await ctx.db
        .query("participants")
        .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
        .collect();

      if (count.length >= tournament.maxParticipants) {
        throw new Error("Tournament is full");
      }
    }

    // Check if already registered (by email)
    const existing = await ctx.db
      .query("participants")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      throw new Error("You are already registered for this tournament");
    }

    const participantId = await ctx.db.insert("participants", args);
    return participantId;
  },
});

// Update participant
export const update = mutation({
  args: {
    id: v.id("participants"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    club: v.optional(v.string()),
    eloRating: v.optional(v.number()),
    level: v.optional(v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("competition")
    )),
    gender: v.optional(v.union(v.literal("M"), v.literal("F"))),
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

// Assign participant to pool
export const assignToPool = mutation({
  args: {
    id: v.id("participants"),
    poolId: v.id("pools"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { poolId: args.poolId });
    return args.id;
  },
});

// Update seed
export const updateSeed = mutation({
  args: {
    id: v.id("participants"),
    seed: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { seed: args.seed });
    return args.id;
  },
});

// Remove participant
export const remove = mutation({
  args: { id: v.id("participants") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Bulk add participants
export const bulkCreate = mutation({
  args: {
    tournamentId: v.id("tournaments"),
    participants: v.array(v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      club: v.optional(v.string()),
      level: v.optional(v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced"),
        v.literal("competition")
      )),
      gender: v.optional(v.union(v.literal("M"), v.literal("F"))),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const participant of args.participants) {
      const id = await ctx.db.insert("participants", {
        tournamentId: args.tournamentId,
        ...participant,
      });
      ids.push(id);
    }
    return ids;
  },
});

// ============================================
// Queries pour le Dashboard
// ============================================

// Get tournaments where current user is registered (for player dashboard)
export const getMyRegistrations = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return [];

    const appUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .first();

    if (!appUser) return [];

    // Get participations by user ID
    const participations = await ctx.db
      .query("participants")
      .withIndex("by_user", (q) => q.eq("userId", appUser._id))
      .collect();

    // Get tournament details for each participation
    const tournamentsWithParticipation = await Promise.all(
      participations.map(async (p) => {
        const tournament = await ctx.db.get(p.tournamentId);
        return tournament ? { ...p, tournament } : null;
      })
    );

    return tournamentsWithParticipation.filter((t) => t !== null);
  },
});

// Get player stats for dashboard
export const getPlayerStats = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return null;

    const appUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .first();

    if (!appUser) return null;

    const participations = await ctx.db
      .query("participants")
      .withIndex("by_user", (q) => q.eq("userId", appUser._id))
      .collect();

    // Future: count matches played, calculate win rate
    return {
      tournamentsParticipated: participations.length,
      matchesPlayed: 0, // Future implementation
      winRate: null, // Future implementation
    };
  },
});
