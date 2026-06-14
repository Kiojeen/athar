import { api } from "../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

/**
 * Validates that the active session belongs to a system administrator.
 * Throws a Next.js redirect if the user is unauthenticated or not an admin.
 *
 * @returns The fully typed Convex user document
 */
export async function requireAdmin() {
  const token = await convexAuthNextjsToken();

  if (!token) {
    redirect("/login");
  }

  const user = await fetchQuery(api.users.getCurrentUser, {}, { token });

  if (!user || !user.isAdmin) {
    redirect("/");
  }

  return user;
}
