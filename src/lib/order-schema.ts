// src/lib/orderSchema.ts  — shared Zod schema for the order form
import * as z from "zod";

export const SCARF_TYPES = ["أمريكي جهتين تطريز", "ملكي تطريز"] as const;

export const ROBE_SIZES = [
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
  "48",
  "50",
  "52",
  "بدون روب",
] as const;

export const profileSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z
    .string()
    .min(7, "رقم الجوال غير صحيح")
    .regex(/^[0-9+\s\-()]+$/, "رقم الجوال غير صحيح"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const orderSchema = z.object({
  scarfType: z.enum(SCARF_TYPES, {
    error: "يرجى اختيار نوع الوشاح",
  }),

  scarfName: z
    .string()
    .min(2, "الاسم على الوشاح مطلوب")
    .max(60, "الاسم طويل جداً"),

  backText: z.string().max(100, "النص طويل جداً").optional().or(z.literal("")),

  backImageStorageId: z.string().optional(),

  hatTextTop: z.string().max(60, "النص طويل جداً").optional().or(z.literal("")),

  hatTextSide: z
    .string()
    .max(60, "النص طويل جداً")
    .optional()
    .or(z.literal("")),

  hatImageStorageId: z.string().optional(),

  robeSize: z.enum(ROBE_SIZES, {
    error: "يرجى اختيار قياس الروب",
  }),

  robeSleeveLengthNote: z
    .string()
    .max(200, "الملاحظة طويلة جداً")
    .optional()
    .or(z.literal("")),

  certificateName: z
    .string()
    .min(2, "الاسم على الشهادة مطلوب")
    .max(80, "الاسم طويل جداً"),

  notes: z
    .string()
    .max(500, "الملاحظات طويلة جداً")
    .optional()
    .or(z.literal("")),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
