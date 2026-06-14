"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        disabled
        aria-label="تبديل المظهر"
        className="flex size-9 items-center justify-center overflow-hidden rounded-[9px] transition-all duration-150"
      >
        <div className={cn("flex flex-col transition-transform duration-300")}>
          <span className="flex size-9 items-center justify-center">
            <Sun className="size-3.5" />
          </span>
        </div>
      </Button>
    );
  }

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
