"use client";
import { Suspense } from "react";
import { api } from "@/convex/_generated/api";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useQuery } from "convex/react";
import { Edit3, Loader2, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import Package from "@/components/package";
import Link from "next/link";

const features = [
  { n: "01", title: "تطريز عالي الجودة", desc: "خيوط ممتازة لا تبهت مع الوقت" },
  {
    n: "02",
    title: "تسليم في الوقت المحدد",
    desc: "نلتزم بموعد حفل تخرجك دون تأخير",
  },
  {
    n: "03",
    title: "تصميم شخصي بالكامل",
    desc: "كل وشاح يُطرَّز باسمك أنت فقط",
  },
];

function SceneContent() {
  return (
    <>
      {/* Raised Y-position from 1.2 to 2.8 to look down on the box */}
      <PerspectiveCamera makeDefault position={[0, 2.8, 9.5]} fov={40} />

      <ambientLight intensity={0.4} />

      <Environment preset="park" />

      <Suspense fallback={null}>
        <group scale={1} position={[0, -0.3, 0]}>
          <Package />
        </group>
      </Suspense>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.8}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        makeDefault
      />
    </>
  );
}

export default function LandingPage() {
  const user = useQuery(api.users.getCurrentUser);
  const existingOrder = useQuery(api.orders.getMyOrder);
  const isLoading = user === undefined || existingOrder === undefined;

  return (
    <div className="bg-background text-foreground relative min-h-screen w-full overflow-hidden">
      <span
        aria-hidden="true"
        className="text-foreground font-amiri pointer-events-none absolute top-1/2 right-8 z-0 -translate-y-1/2 text-[22rem] leading-none font-black opacity-[0.05] select-none"
      >
        أثر
      </span>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row-reverse">
        <div className="relative h-[52vh] w-full shrink-0 lg:h-screen lg:w-[55%]">
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 hidden w-40 lg:block"
            style={{
              background:
                "linear-gradient(to right, hsl(var(--background)), transparent)",
            }}
          />
          {/* Top fade for mobile */}
          <div
            className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-16 lg:hidden"
            style={{
              background:
                "linear-gradient(to bottom, hsl(var(--background)), transparent)",
            }}
          />
          {/* Bottom fade */}
          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-24"
            style={{
              background:
                "linear-gradient(to top, hsl(var(--background)), transparent)",
            }}
          />

          <div className="h-full w-full cursor-grab active:cursor-grabbing">
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
              <SceneContent />
            </Canvas>
          </div>
        </div>

        {/* ── Content — left 45% ──────────────────────────────── */}
        <div className="flex w-full shrink-0 flex-col justify-center gap-10 px-8 py-16 sm:px-14 lg:w-[45%] lg:px-20 lg:py-0">
          {/* Headline block */}
          <div className="space-y-5">
            <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.3em] uppercase">
              لحظة نجاحك تستحق الأفضل
            </p>
            <h1 className="font-amiri text-[2.6rem] leading-[1.15] font-extrabold tracking-tight sm:text-5xl">
              وشاح التخرج
              <br />
              <span className="text-primary">الخاص بك</span>
            </h1>
            <p className="text-muted-foreground max-w-85 text-[15px] leading-[1.85]">
              صمّم وشاحك وقبعتك وروبك بأدق التفاصيل. كل قطعة تُطرَّز لتليق بلحظة
              نجاحك.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {isLoading ? (
              <Button disabled size="lg" className="h-11 min-w-40 gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري التحميل...
              </Button>
            ) : existingOrder ? (
              <Button size="lg" className="h-11 min-w-40 gap-2" asChild>
                <Link href="/order">
                  <Edit3 className="h-4 w-4" />
                  تعديل طلبي الحالي
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="h-11 min-w-40 gap-2" asChild>
                <Link href="/order">
                  <ShoppingBag className="h-4 w-4" />
                  ابدأ طلبك الآن
                </Link>
              </Button>
            )}
          </div>

          {!user && !isLoading && (
            <p className="text-muted-foreground -mt-6 text-xs">
              يرجى تسجيل الدخول للبدء
            </p>
          )}

          {/* Features — rule list */}
          <div className="border-border/50 space-y-0 border-t">
            {features.map(({ n, title, desc }) => (
              <div
                key={n}
                className="border-border/50 flex items-start gap-4 border-b py-4"
              >
                <span className="text-muted-foreground/50 mt-0.5 w-6 shrink-0 font-mono text-[11px]">
                  {n}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-sm leading-none font-semibold">
                    {title}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
