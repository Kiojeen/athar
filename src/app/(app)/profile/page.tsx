"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Check, Loader2, Pencil, Phone, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [initialised, setInitialised] = useState(false);
  if (user && !initialised) {
    setName(user.name ?? "");
    setPhone(user.phone ?? "");
    setInitialised(true);
  }

  const isDirty =
    user && (name !== (user.name ?? "") || phone !== (user.phone ?? ""));

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
    : "؟";

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">الملف الشخصي</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          إدارة معلوماتك الشخصية
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.image ?? undefined} />
              <AvatarFallback className="bg-[#c3986d]/20 text-lg font-semibold text-[#c3986d]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-base leading-none font-semibold">
                {user?.name ?? "—"}
              </p>
              <p className="text-muted-foreground text-sm">
                {user?.email ?? ""}
              </p>
              <Badge variant="secondary" className="mt-1 text-xs">
                تسجيل دخول عبر Google
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Pencil className="text-muted-foreground h-4 w-4" />
            تعديل البيانات
          </CardTitle>
          <CardDescription className="text-xs">
            يمكنك تحديث اسمك ورقم جوالك في أي وقت
          </CardDescription>
        </CardHeader>

        <Separator className="mb-6" />

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              <UserRound className="text-muted-foreground h-3.5 w-3.5" />
              الاسم الكامل
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
              className="h-10 text-right"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              <Phone className="text-muted-foreground h-3.5 w-3.5" />
              رقم الجوال
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07xxxxxxxxx"
              className="h-10 text-right"
              type="tel"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">
              البريد الإلكتروني
            </Label>
            <Input
              value={user?.email ?? ""}
              disabled
              className="bg-muted/40 text-muted-foreground h-10 cursor-not-allowed text-right"
            />
            <p className="text-muted-foreground text-xs">
              يُدار البريد الإلكتروني عبر حساب Google ولا يمكن تغييره من هنا
            </p>
          </div>

          <div className="flex justify-start pt-1">
            <Button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className="min-w-32 gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جارٍ الحفظ…
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" />
                  تم الحفظ
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
