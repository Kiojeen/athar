import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuth = await isAuthenticatedNextjs();
  if (isAuth) {
    redirect("/");
  }

  return <main>{children}</main>;
}
