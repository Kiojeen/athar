"use client";

import { ArrowLeft, Home, ShieldAlert, UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center p-4">
      <span
        aria-hidden="true"
        className="text-foreground font-amiri pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[18rem] leading-none font-black opacity-[0.03] select-none"
      >
        أثر
      </span>

      <Card className="border-border/60 relative z-10 w-full max-w-md text-center shadow-lg">
        <CardHeader className="pt-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#c3986d]/10 text-[#c3986d]">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <CardTitle className="font-amiri text-2xl font-bold">
            وصول غير مصرح به
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">
            عذراً، لا تملك الصلاحيات الكافية للوصول إلى هذه الصفحة. يرجى التأكد
            من تسجيل الدخول بالحساب المناسب أو التواصل مع الإدارة إذا كنت تعتقد
            أن هذا الخطأ غير صحيح.
          </p>
        </CardContent>

        <CardFooter className="border-border/40 flex flex-col gap-2.5 border-t pt-6">
          <Button asChild className="w-full gap-2" size="default">
            <Link href="/">
              <Home className="h-4 w-4" />
              العودة إلى الصفحة الرئيسية
            </Link>
          </Button>

          <div className="grid w-full grid-cols-2 gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <Link href="/profile">
                <UserRound className="h-3.5 w-3.5" />
                الملف الشخصي
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1.5 text-xs"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              رجوع للخلف
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
