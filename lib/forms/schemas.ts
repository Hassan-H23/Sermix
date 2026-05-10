import { z } from "zod";

// Egyptian mobile pattern. Accepts +20 and 0 prefixes, then 10/11/12/15 with
// 8 digits. Leading zero is preserved (CLAUDE.md gotcha). Whitespace and
// dashes are stripped before validation, so users can type whatever shape
// feels natural.
const egyptianPhoneRegex = /^(\+20|0)?(10|11|12|15)\d{8}$/;

const normalisedPhone = z
  .string()
  .min(1, { message: "phoneRequired" })
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => egyptianPhoneRegex.test(v), { message: "phoneInvalid" });

// ─────────────────────────────────────────────────────────────────────────────
// Contact form — free-text enquiries from any page.
// ─────────────────────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, { message: "nameRequired" }).max(80),
  company: z.string().max(120).optional().or(z.literal("")),
  email: z.string().email({ message: "emailInvalid" }).max(120),
  phone: normalisedPhone,
  message: z.string().min(10, { message: "messageTooShort" }).max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Order form — concrete request from contractor / site engineer.
// ─────────────────────────────────────────────────────────────────────────────
export const concreteGrades = [
  "C20", "C25", "C30", "C35", "C40", "C45", "C50", "other",
] as const;

export const orderSchema = z.object({
  // Project info
  projectName: z.string().min(2, { message: "projectNameRequired" }).max(120),
  projectLocation: z
    .string()
    .min(2, { message: "projectLocationRequired" })
    .max(200),
  contractor: z.string().max(120).optional().or(z.literal("")),

  // Concrete spec
  grade: z.enum(concreteGrades, { message: "gradeRequired" }),
  // RHF passes a number via `valueAsNumber` so we don't need z.coerce here.
  volumeM3: z
    .number({ message: "volumeRequired" })
    .positive({ message: "volumeRequired" })
    .max(10000, { message: "volumeTooLarge" }),
  slump: z.string().max(40).optional().or(z.literal("")),

  // Schedule
  date: z.string().min(1, { message: "dateRequired" }),
  timeWindow: z.string().max(40).optional().or(z.literal("")),

  // Site contact
  contactName: z.string().min(2, { message: "contactNameRequired" }).max(80),
  contactPhone: normalisedPhone,
  contactEmail: z.string().email({ message: "emailInvalid" }).max(120),

  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type OrderInput = z.infer<typeof orderSchema>;
