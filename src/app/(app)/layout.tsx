import UniPortalProvider from "@/providers/uni-portal-provider";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuth = await isAuthenticatedNextjs();
  if (!isAuth) {
    redirect("/login");
  }
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <UniPortalProvider>{children}</UniPortalProvider>
      </main>
    </div>
  );
}
