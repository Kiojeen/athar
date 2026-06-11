// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),

  orders: defineTable({
    userId: v.id("users"),

    // Scarf type
    scarfType: v.union(
      v.literal("أمريكي جهتين تطريز"),
      v.literal("ملكي تطريز")
    ),

    // Name on scarf
    scarfName: v.string(),

    // Back text
    backText: v.optional(v.string()),

    // Illustrative image for back text (ملكي only) — stored as storage ID
    backImageId: v.optional(v.id("_storage")),

    // Hat text — top
    hatTextTop: v.optional(v.string()),

    // Hat text — side
    hatTextSide: v.optional(v.string()),

    // Illustrative image for hat — stored as storage ID
    hatImageId: v.optional(v.id("_storage")),

    // Robe size
    robeSize: v.union(
      v.literal("36"),
      v.literal("38"),
      v.literal("40"),
      v.literal("42"),
      v.literal("44"),
      v.literal("46"),
      v.literal("48"),
      v.literal("50"),
      v.literal("52"),
      v.literal("بدون روب")
    ),

    // Sleeve + robe length
    robeSleeveLengthNote: v.optional(v.string()),

    // Name on certificate
    certificateName: v.string(),

    // Notes
    notes: v.optional(v.string()),

    // Submission timestamp
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});

export default schema;