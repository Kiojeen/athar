"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  
  const isDark = resolvedTheme === "dark";
  return (
    <Button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="تبديل المظهر"
      className="flex size-9 items-center justify-center overflow-hidden rounded-[9px] transition-all duration-150"
    >
      <div
        className={cn(
          "flex flex-col transition-transform duration-300",
          isDark ? "translate-y-1/4" : "-translate-y-1/4",
        )}
      >
        <span className="flex size-9 items-center justify-center">
          <Moon className="size-3.5" />
        </span>
        <span className="flex size-9 items-center justify-center">
          <Sun className="size-3.5" />
        </span>
      </div>
    </Button>
  );
}
