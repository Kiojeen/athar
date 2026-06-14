import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";

import { api } from "./convex/_generated/api";

const isLoginPage = createRouteMatcher(["/login(.*)"]);
const isProtectedRoute = createRouteMatcher([
  "/",
  "/dashboard(.*)",
  "/profile(.*)",
  "/order(.*)",
]);
const isAdminRoute = createRouteMatcher(["/dashboard(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();

  if (isLoginPage(request) && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/");
  }
  if (isProtectedRoute(request) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/login");
  }

  if (isAdminRoute(request) && isAuthenticated) {
    const token = await convexAuth.getToken();
    const user = await fetchQuery(api.users.getCurrentUser, {}, { token });

    if (!user || !user.isAdmin) {
      return nextjsMiddlewareRedirect(request, "/unauthorized");
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
