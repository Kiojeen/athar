"use client";

import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { LayoutDashboard, LogOut, Moon, Sun, UserRound } from "lucide-react";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const { signOut } = useAuthActions();

  const user = useQuery(api.users.getCurrentUser);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
    : "؟";

  return (
    <header className="border-border/25 bg-secondary sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div
        className="absolute right-0 bottom-0 left-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(197,168,128,0.45), transparent)",
        }}
      />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Button variant="link" asChild>
          <Link href="/">
            <div className="flex items-center gap-2.5">
              <div className="flex shrink-0 items-center justify-center rounded-[10px]">
                <img
                  src="/brand-logo.png"
                  alt="أثر"
                  className="size-10 object-contain"
                />
              </div>
              <span
                className="font-hend text-xl font-bold text-primary"
             
              >
                أثـــــــر
              </span>
            </div>
          </Link>
        </Button>

        <nav className="hidden items-center gap-2.5 md:flex">
          <div
            className="flex items-center overflow-hidden rounded-[10px]"
            style={{
              border: "1px solid rgba(197,168,128,0.22)",
              background: "rgba(197,168,128,0.07)",
            }}
          >
            {user?.isAdmin && (
              <Button asChild>
                <Link
                  prefetch
                  href="/dashboard"
                  className="flex h-9 items-center gap-1.5 px-3.5 text-sm first:rounded-r-[10px] last:rounded-l-[10px]"
                >
                  <LayoutDashboard className="size-3.5" />
                  لوحة التحكم
                </Link>
              </Button>
            )}

            <Button asChild>
              <Link
                prefetch
                href="/profile"
                className="flex h-9 items-center gap-1.5 px-3.5 text-sm first:rounded-r-[10px] last:rounded-l-[10px]"
              >
                <UserRound className="size-3.5" />
                الملف الشخصي
              </Link>
            </Button>
          </div>

          <div
            className="flex items-center overflow-hidden rounded-[10px]"
            style={{
              border: "1px solid rgba(197,168,128,0.22)",
              background: "rgba(197,168,128,0.07)",
            }}
          >
            <ThemeToggle />
          </div>

          <div
            className="h-5 w-px"
            style={{ background: "rgba(197,168,128,0.2)" }}
          />

          <Avatar
            className="size-9 cursor-pointer"
            style={{ border: "1.5px solid rgba(197,168,128,0.3)" }}
          >
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback
              className="text-[11px] font-semibold"
              style={{
                background: "rgba(197,168,128,0.1)",
                color: "#c5a880",
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          <Button
            variant="ghost"
            onClick={() => signOut()}
            className="dark:hover:text-background flex h-9 items-center gap-1.5 rounded-[9px] px-3.5 text-sm text-white transition-all duration-150 dark:hover:bg-white"
          >
            <LogOut />
            تسجيل الخروج
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <div
            className="flex items-center overflow-hidden rounded-[10px]"
            style={{
              border: "1px solid rgba(197,168,128,0.22)",
              background: "rgba(197,168,128,0.07)",
            }}
          >
            <ThemeToggle />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar
                className="size-8 cursor-pointer"
                style={{ border: "1.5px solid rgba(197,168,128,0.3)" }}
              >
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback
                  className="text-[10px] font-semibold"
                  style={{
                    background: "rgba(197,168,128,0.1)",
                    color: "#c5a880",
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <div className="px-2 py-2">
                <p className="text-sm leading-none font-medium">
                  {user?.name ?? "…"}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {user?.email ?? ""}
                </p>
              </div>
              <DropdownMenuSeparator />

              {user?.isAdmin && (
                <DropdownMenuItem asChild className="cursor-pointer gap-2">
                  <Link href="/dashboard">
                    <LayoutDashboard className="size-4" />
                    لوحة التحكم
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem asChild className="cursor-pointer gap-2">
                <Link href="/profile">
                  <UserRound className="size-4" />
                  الملف الشخصي
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer gap-2"
                onClick={() => signOut()}
              >
                <LogOut className="size-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
