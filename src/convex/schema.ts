import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table (organisateurs et joueurs)
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    role: v.union(v.literal("organizer"), v.literal("player")),
    authId: v.optional(v.string()), // ID Better Auth pour liaison
  })
    .index("by_email", ["email"])
    .index("by_auth_id", ["authId"]),

  // Tournaments table
  tournaments: defineTable({
    organizerId: v.id("users"),

    // Infos de base
    name: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),

    // Dates
    startDate: v.string(), // ISO date string
    endDate: v.optional(v.string()),
    startTime: v.optional(v.string()),

    // Configuration
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

    // Config technique
    nbCourts: v.optional(v.number()),
    matchDuration: v.optional(v.number()), // minutes

    // Statut
    status: v.union(
      v.literal("draft"),
      v.literal("registration_open"),
      v.literal("in_progress"),
      v.literal("finished")
    ),

    // Settings spécifiques au format (flexible)
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
  })
    .index("by_organizer", ["organizerId"])
    .index("by_status", ["status"])
    .index("by_start_date", ["startDate"]),

  // Participants table
  participants: defineTable({
    tournamentId: v.id("tournaments"),
    userId: v.optional(v.id("users")), // null si joueur non inscrit

    // Infos joueur
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    club: v.optional(v.string()),

    // Niveau
    eloRating: v.optional(v.number()),
    level: v.optional(v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("competition")
    )),

    // Genre (pour tournois mixtes)
    gender: v.optional(v.union(v.literal("M"), v.literal("F"))),

    // Seeding
    seed: v.optional(v.number()),

    // Poule assignée
    poolId: v.optional(v.id("pools")),
  })
    .index("by_tournament", ["tournamentId"])
    .index("by_user", ["userId"])
    .index("by_pool", ["poolId"]),

  // Teams table (pour doubles/mixtes)
  teams: defineTable({
    tournamentId: v.id("tournaments"),
    player1Id: v.id("participants"),
    player2Id: v.id("participants"),
    teamName: v.optional(v.string()),
    seed: v.optional(v.number()),
    poolId: v.optional(v.id("pools")),
  })
    .index("by_tournament", ["tournamentId"])
    .index("by_pool", ["poolId"]),

  // Pools table
  pools: defineTable({
    tournamentId: v.id("tournaments"),
    poolName: v.string(), // "Poule A", "Poule B"...
    poolNumber: v.number(),
  })
    .index("by_tournament", ["tournamentId"]),

  // Matches table
  matches: defineTable({
    tournamentId: v.id("tournaments"),

    // Position dans le tournoi
    round: v.number(),
    matchNumber: v.number(),
    phase: v.optional(v.union(
      v.literal("pool"),
      v.literal("elimination"),
      v.literal("final")
    )),

    // Poule (si match de poule)
    poolId: v.optional(v.id("pools")),

    // Planning
    court: v.optional(v.number()),
    scheduledTime: v.optional(v.string()),

    // Participants (soit participants, soit teams)
    participant1Id: v.optional(v.id("participants")),
    participant2Id: v.optional(v.id("participants")),
    team1Id: v.optional(v.id("teams")),
    team2Id: v.optional(v.id("teams")),

    // Résultats - scores par set [21, 19, 21]
    scoreParticipant1: v.optional(v.array(v.number())),
    scoreParticipant2: v.optional(v.array(v.number())),
    winnerId: v.optional(v.string()), // ID du vainqueur (participant ou team)

    // Statut
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("finished"),
      v.literal("walkover"),
      v.literal("disqualified")
    ),

    // Métadonnées
    enteredBy: v.optional(v.id("users")),
    validated: v.boolean(),
    comment: v.optional(v.string()),
  })
    .index("by_tournament", ["tournamentId"])
    .index("by_pool", ["poolId"])
    .index("by_status", ["status"])
    .index("by_tournament_round", ["tournamentId", "round"]),

  // Pool standings table
  poolStandings: defineTable({
    poolId: v.id("pools"),
    participantId: v.optional(v.id("participants")),
    teamId: v.optional(v.id("teams")),

    // Stats
    matchesPlayed: v.number(),
    matchesWon: v.number(),
    matchesLost: v.number(),
    setsWon: v.number(),
    setsLost: v.number(),
    pointsScored: v.number(),
    pointsConceded: v.number(),

    // Classement
    position: v.optional(v.number()),
  })
    .index("by_pool", ["poolId"])
    .index("by_participant", ["participantId"])
    .index("by_team", ["teamId"]),
});
