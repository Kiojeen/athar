import * as React from "react";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Upload, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  orderSchema,
  profileSchema,
  ROBE_SIZES,
  SCARF_TYPES,
  type OrderFormValues,
  type ProfileFormValues,
} from "@/lib/order-schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect } from "react";


function ProfileStep({ onDone }: { onDone: () => void }) {
  const updateProfile = useMutation(api.users.updateProfile);
  const user = useQuery(api.users.getCurrentUser);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile(data);
    onDone();
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">أكمل ملفك أولاً</CardTitle>
        <CardDescription className="text-xs">
          نحتاج إلى اسمك ورقم جوالك قبل تقديم الطلب
        </CardDescription>
      </CardHeader>
      <Separator className="mb-6" />
      <CardContent>
        <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="profile-name">الاسم الكامل</FieldLabel>
                  <Input
                    {...field}
                    id="profile-name"
                    dir="rtl"
                    placeholder="أدخل اسمك الكامل"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="profile-phone">رقم الجوال</FieldLabel>
                  <Input
                    {...field}
                    id="profile-phone"
                    dir="rtl"
                    type="tel"
                    placeholder="07xxxxxxxxx"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <div className="mt-6 flex justify-start">
          <Button
            type="submit"
            form="profile-form"
            disabled={form.formState.isSubmitting}
            className="gap-2"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            متابعة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


function ImageUploadField({
  label,
  note,
  fieldId,
  value,
  onChange,
}: {
  label: string;
  note?: string;
  fieldId: string;
  value?: string;
  onChange: (storageId: string | undefined) => void;
}) {
  const generateUploadUrl = useMutation(api.orders.generateUploadUrl);
  const [uploading, setUploading] = React.useState(false);
  const [fileName, setFileName] = React.useState<string>();
  const ref = React.useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await generateUploadUrl();
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      onChange(storageId);
      setFileName(file.name);
    } finally {
      setUploading(false);
    }
  };

  const clear = () => {
    onChange(undefined);
    setFileName(undefined);
    if (ref.current) ref.current.value = "";
  };

  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      {note && <FieldDescription>{note}</FieldDescription>}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => ref.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          {value ? "تغيير الصورة" : "رفع صورة"}
        </Button>
        {value && (
          <div className="text-muted-foreground bg-muted flex items-center gap-1.5 rounded-md px-2 py-1 text-xs">
            <span className="max-w-40 truncate">
              {fileName || "صورة مرفوعة مسبقاً"}
            </span>
            <button
              type="button"
              onClick={clear}
              className="hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      <input
        ref={ref}
        id={fieldId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </Field>
  );
}

// ─── Order form ──────────────────────────────────────────────────────────────

function OrderForm() {
  const submitOrder = useMutation(api.orders.submitOrder);
  const existingOrder = useQuery(api.orders.getMyOrder);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      scarfType: undefined,
      scarfName: "",
      backText: "",
      backImageStorageId: undefined,
      hatTextTop: "",
      hatTextSide: "",
      hatImageStorageId: undefined,
      robeSize: undefined,
      robeSleeveLengthNote: "",
      certificateName: "",
      notes: "",
    },
  });

useEffect(() => {
  if (!existingOrder) return;

  form.reset({
    scarfType: existingOrder.scarfType,
    scarfName: existingOrder.scarfName,
    backText: existingOrder.backText ?? "",
    backImageStorageId: existingOrder.backImageId, 
    hatTextTop: existingOrder.hatTextTop ?? "",
    hatTextSide: existingOrder.hatTextSide ?? "",
    hatImageStorageId: existingOrder.hatImageId, 
    robeSize: existingOrder.robeSize,
    robeSleeveLengthNote: existingOrder.robeSleeveLengthNote ?? "",
    certificateName: existingOrder.certificateName,
    notes: existingOrder.notes ?? "",
  });
}, [existingOrder, form]);

  const scarfType = form.watch("scarfType");

const onSubmit = async (data: OrderFormValues) => {
    try {
      await submitOrder({
        scarfType: data.scarfType,
        scarfName: data.scarfName,
        backText: data.backText || undefined,
        backImageStorageId: data.backImageStorageId as any,
        hatTextTop: data.hatTextTop || undefined,
        hatTextSide: data.hatTextSide || undefined,
        hatImageStorageId: data.hatImageStorageId as any,
        robeSize: data.robeSize,
        robeSleeveLengthNote: data.robeSleeveLengthNote || undefined,
        certificateName: data.certificateName,
        notes: data.notes || undefined,
      });

      toast(existingOrder ? "تم تحديث طلبك بنجاح ✓" : "تم إرسال طلبك بنجاح ✓");
      
      if (!existingOrder) {
        form.reset();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الطلب");
    }
  };

  return (
    <form id="order-form" onSubmit={form.handleSubmit(onSubmit)} dir="rtl">
      <div className="space-y-6">
        {/* ── نوع الوشاح ─────────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              تفاصيل الوشاح
            </CardTitle>
          </CardHeader>
          <Separator className="mb-5" />
          <CardContent>
            <FieldGroup>
              <Controller
                name="scarfType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>نوع الوشاح</FieldLabel>
                    <ToggleGroup
                      type="single"
                      value={field.value ?? ""}
                      onValueChange={(v) => v && field.onChange(v)}
                      className="flex flex-wrap justify-start gap-2"
                    >
                      {SCARF_TYPES.map((t) => (
                        <ToggleGroupItem
                          key={t}
                          value={t}
                          className="border-border data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary h-9 rounded-lg border px-4 text-sm"
                        >
                          {t}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="scarfName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="scarfName">
                      الاسم على الوشاح
                    </FieldLabel>
                    <FieldDescription>يفضل أن يكون ثلاثي</FieldDescription>
                    <Input
                      {...field}
                      id="scarfName"
                      dir="rtl"
                      placeholder="الاسم الأول والأوسط والأخير"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="backText"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="backText">
                      الكتابة على ظهر الوشاح
                    </FieldLabel>
                    <Input
                      {...field}
                      id="backText"
                      dir="rtl"
                      placeholder="النص المراد كتابته على الظهر"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Back image — ملكي only */}
              {scarfType === "ملكي تطريز" && (
                <Controller
                  name="backImageStorageId"
                  control={form.control}
                  render={({ field }) => (
                    <ImageUploadField
                      label="صورة توضيحية للكتابة على ظهر الوشاح (الملكي)"
                      note="إن وجد"
                      fieldId="backImage"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
            </FieldGroup>
          </CardContent>
        </Card>

        {/* ── القبعة ─────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              تفاصيل القبعة
            </CardTitle>
          </CardHeader>
          <Separator className="mb-5" />
          <CardContent>
            <FieldGroup>
              <Controller
                name="hatTextTop"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="hatTextTop">
                      الكتابة على القبعة (أعلى)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="hatTextTop"
                      dir="rtl"
                      placeholder="النص أعلى القبعة"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="hatTextSide"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="hatTextSide">
                      الكتابة على القبعة (جانب)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="hatTextSide"
                      dir="rtl"
                      placeholder="النص على جانب القبعة"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="hatImageStorageId"
                control={form.control}
                render={({ field }) => (
                  <ImageUploadField
                    label="أضف صورة توضيحية للقبعة"
                    note="إن وجد"
                    fieldId="hatImage"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* ── الروب ──────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              تفاصيل الروب
            </CardTitle>
          </CardHeader>
          <Separator className="mb-5" />
          <CardContent>
            <FieldGroup>
              <Controller
                name="robeSize"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>قياس متن الروب (للبنات)*</FieldLabel>
                    <ToggleGroup
                      type="single"
                      value={field.value ?? ""}
                      onValueChange={(v) => v && field.onChange(v)}
                      className="flex flex-wrap justify-start gap-2"
                    >
                      {ROBE_SIZES.map((s) => (
                        <ToggleGroupItem
                          key={s}
                          value={s}
                          className="border-border data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary h-9 rounded-lg border px-4 text-sm"
                        >
                          {s}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="robeSleeveLengthNote"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="robeSleeveLengthNote">
                      قياس الردن وطول الروب
                    </FieldLabel>
                    <Input
                      {...field}
                      id="robeSleeveLengthNote"
                      dir="rtl"
                      placeholder="مثال: طول الردن 60 سم، طول الروب 140 سم"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* ── الشهادة والملاحظات ──────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              معلومات إضافية
            </CardTitle>
          </CardHeader>
          <Separator className="mb-5" />
          <CardContent>
            <FieldGroup>
              <Controller
                name="certificateName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="certificateName">
                      الاسم على الشهادة*
                    </FieldLabel>
                    <Input
                      {...field}
                      id="certificateName"
                      dir="rtl"
                      placeholder="الاسم كما سيظهر على الشهادة"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="notes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="notes">الملاحظات</FieldLabel>
                    <Textarea
                      {...field}
                      id="notes"
                      dir="rtl"
                      placeholder="أي ملاحظات إضافية..."
                      className="min-h-25 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* ── Submit ──────────────────────────────────── */}
        <div className="flex justify-start pb-8">
          <Button
            type="submit"
            form="order-form"
            disabled={form.formState.isSubmitting}
            className="h-11 min-w-36 gap-2 text-base"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {form.formState.isSubmitting
              ? "جارٍ الإرسال…"
              : !existingOrder
              ? "إرسال الطلب"
              : "تحديث الطلب"}
          </Button>
        </div>
      </div>
    </form>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OrderPage() {
  const user = useQuery(api.users.getCurrentUser);
  const profileComplete = !!(user?.name && user?.phone);
  const [profileDone, setProfileDone] = React.useState(false);

  const showOrderForm = profileComplete || profileDone;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">طلب جديد</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          أدخل تفاصيل طلبك بدقة
        </p>
      </div>

      {!showOrderForm ? (
        <ProfileStep onDone={() => setProfileDone(true)} />
      ) : (
        <OrderForm />
      )}
    </div>
  );
}