import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await getAuthUserId(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const submitOrder = mutation({
  args: {
    scarfType: v.union(
      v.literal("أمريكي جهتين تطريز"),
      v.literal("ملكي تطريز")
    ),
    scarfName: v.string(),
    backText: v.optional(v.string()),
    backImageStorageId: v.optional(v.id("_storage")),
    hatTextTop: v.optional(v.string()),
    hatTextSide: v.optional(v.string()),
    hatImageStorageId: v.optional(v.id("_storage")),
    robeSize: v.union(
      v.literal("36"), v.literal("38"), v.literal("40"), v.literal("42"),
      v.literal("44"), v.literal("46"), v.literal("48"), v.literal("50"),
      v.literal("52"), v.literal("بدون روب")
    ),
    robeSleeveLengthNote: v.optional(v.string()),
    certificateName: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("غير مسجل الدخول");

    // Check if the user already has an existing order
    const existingOrder = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    // Destructure properties to map them to the schema field names
    const { backImageStorageId, hatImageStorageId, ...rest } = args;

    const orderData = {
      ...rest,
      backImageId: backImageStorageId,
      hatImageId: hatImageStorageId,
    };

    if (existingOrder) {
      await ctx.db.patch(existingOrder._id, orderData);
      return existingOrder._id;
    } else {
      return await ctx.db.insert("orders", {
        userId,
        ...orderData,
        createdAt: Date.now(),
      });
    }
  },
});

export const getMyOrder = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Fetch the most recent order using desc order
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();
  },
});