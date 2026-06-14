"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Google } from "@/components/ui/svgs/google";
import { useConvexAuth } from "convex/react";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useConvexAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { redirectTo: "/" });
    } catch (err) {
      console.error("Sign-in failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background flex h-screen items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/5 absolute top-1/3 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <div className="bg-secondary p-6">
            <img
              src="/brand-logo.png"
              alt="أثر"
              width={120}
              height={120}
              className="pointer-events-none object-contain select-none"
              draggable={false}
            />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="font-hend text-2xl font-semibold tracking-tight">
            أزياء تترك أثر لاينسى
          </h1>
          <p className="text-muted-foreground text-sm">سجّل دخولك للمتابعة</p>
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-xs">
              استخدم حساب Google الخاص بك للبدء
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              variant="outline"
              className="h-10 w-full gap-3 font-medium"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : <Google />}
              {isLoading ? "جارٍ تسجيل الدخول…" : "المتابعة مع Google"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
