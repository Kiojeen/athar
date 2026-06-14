"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

export default function UniPortalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const portalId = searchParams.get("portalId");

  const linkUser = useMutation(api.universities.linkUserToUniversity);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (!portalId) return;

    const run = async () => {
      try {
        const res = await linkUser({
          universityId: portalId as Id<"universities">,
        });

        if (res.status === "already_linked") {
          setBlocked(true);
          setMessage(
            `لا يمكنك الدخول إلى بوابة "${res.universityName}" لأنك مرتبط مسبقًا بجامعة أخرى.`
          );
        }

        if (res.status === "linked") {
          setMessage(
            `مرحبًا بك في بوابة "${res.universityName}" 🎓`
          );
        }

        if (res.status === "admin_blocked") {
          setBlocked(true);
          setMessage("لا يمكن للمشرفين الانضمام إلى بوابات الجامعات.");
        }

        setOpen(true);
      } catch {
        setBlocked(true);
        setMessage("حدث خطأ أثناء التحقق من البوابة.");
        setOpen(true);
      } finally {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("portalId");
        const newQuery = params.toString();
        const newPath = newQuery ? `${pathname}?${newQuery}` : pathname;
        
        router.replace(newPath, { scroll: false });
      }
    };

    run();
  }, [portalId, linkUser, pathname, router, searchParams]);

  return (
    <>
      {children}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {blocked ? "غير مسموح بالدخول" : "مرحبًا"}
            </AlertDialogTitle>

            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <Button onClick={() => setOpen(false)}>حسناً</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}