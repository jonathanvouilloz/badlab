import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

// Get user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get user by ID
export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create or get user (upsert by email)
export const getOrCreate = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update name/avatar if provided
      if (args.name || args.avatarUrl) {
        await ctx.db.patch(existing._id, {
          ...(args.name && { name: args.name }),
          ...(args.avatarUrl && { avatarUrl: args.avatarUrl }),
        });
      }
      return existing._id;
    }

    // Create new user with default role "player"
    const userId = await ctx.db.insert("users", {
      ...args,
      role: "player",
    });
    return userId;
  },
});

// Update user profile
export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
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

// Delete user
export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// ============================================
// Fonctions liées à l'authentification et rôles
// ============================================

// Créer ou récupérer l'utilisateur app lié à l'auth Better Auth
export const getOrCreateAppUser = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return null;

    // Chercher si un user app existe déjà avec cet email
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .first();

    if (existingUser) {
      // Mettre à jour authId si pas encore lié
      if (!existingUser.authId) {
        await ctx.db.patch(existingUser._id, { authId: authUser._id });
      }
      return existingUser;
    }

    // Créer un nouveau user app avec rôle player par défaut
    const userId = await ctx.db.insert("users", {
      email: authUser.email,
      name: authUser.name,
      role: "player",
      authId: authUser._id,
    });

    return await ctx.db.get(userId);
  },
});

// Récupérer l'utilisateur app avec son rôle
export const getCurrentAppUser = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .first();
  },
});

// Vérifier si l'utilisateur est organisateur
export const isOrganizer = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return false;

    const appUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .first();

    return appUser?.role === "organizer";
  },
});

// Récupérer le rôle de l'utilisateur
export const getRole = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return null;

    const appUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .first();

    return appUser?.role ?? null;
  },
});

// Promouvoir un utilisateur en organisateur
export const promoteToOrganizer = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await ctx.db.patch(userId, { role: "organizer" });
  },
});

// Rétrograder un utilisateur en joueur
export const demoteToPlayer = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await ctx.db.patch(userId, { role: "player" });
  },
});
