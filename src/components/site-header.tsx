import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { LogOut, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

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
    <header className="border-border/60 bg-secondary sticky top-0 z-50 w-full border-b">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Button variant="link" asChild>
          <Link to="/">
            <div className="text-primary flex items-center gap-2">
              <div className="shrink-0 rounded-xl p-1.5">
                <img
                  src="/brand-logo.png"
                  alt="أثر"
                  className="size-12 object-contain"
                />
              </div>
              <span className="font-hend text-3xl font-bold tracking-widest">
                أثــــــــــر
              </span>
            </div>
          </Link>
        </Button>

        <div className="border-primary flex flex-row items-center justify-center gap-4 border bg-white  ">
       
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="group border-primary/20 flex h-10 items-center gap-2.5 rounded-lg border-none px-2 py-6 shadow-none transition-colors duration-300 dark:bg-transparent"
              >
                <div className="hidden text-right sm:block">
                  <p className="text-sm leading-none font-medium text-black transition-colors duration-300">
                    {user?.name ?? "…"}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-700 transition-colors duration-300">
                    {user?.email ?? ""}
                  </p>
                </div>
                <Avatar className="size-8">
                  <AvatarImage
                    src={user?.image ?? undefined}
                    className="rounded-none"
                  />
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer gap-2" asChild>
                <Link to="/profile">
                  <UserRound className="h-4 w-4" />
                  <span>الملف الشخصي</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer gap-2"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
