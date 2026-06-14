import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

async function requireAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new ConvexError("غير مسجل الدخول");
  const user = await ctx.db.get(userId);
  if (!user?.isAdmin) throw new ConvexError("غير مصرح");
  return userId;
}

export const createUniversity = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const adminId = await requireAdmin(ctx);
    return await ctx.db.insert("universities", {
      name: args.name,
      createdBy: adminId,
      createdAt: Date.now(),
    });
  },
});


export const getAllUniversities = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const unis = await ctx.db.query("universities").order("desc").collect();

    const withCounts = await Promise.all(
      unis.map(async (u) => {
        const students = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("universityId"), u._id))
          .collect();
        return { ...u, studentCount: students.length };
      })
    );
    return withCounts;
  },
});

export const deleteUniversity = mutation({
  args: { id: v.id("universities") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

// Public: verify a university ID exists (called on the join page)
export const getUniversity = query({
  args: { id: v.id("universities") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const linkUserToUniversity = mutation({
  args: { universityId: v.id("universities") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("غير مسجل الدخول");

    const user = await ctx.db.get(userId);
    if (!user) throw new ConvexError("المستخدم غير موجود");

    const uni = await ctx.db.get(args.universityId);
    if (!uni) {
      throw new ConvexError("البوابة غير موجودة");
    }

    if (user.isAdmin) {
      return { status: "admin_blocked" as const };
    }

    if (user.universityId) {
      return {
        status: "already_linked" as const,
        universityName: uni.name,
      };
    }

    await ctx.db.patch(userId, {
      universityId: args.universityId,
    });

    return {
      status: "linked" as const,
      universityName: uni.name,
    };
  },
});