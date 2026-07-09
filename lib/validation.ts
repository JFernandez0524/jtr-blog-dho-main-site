import { z } from "zod";

// US phone: accepts common formatting — "(908) 739-6797", "908.739.6797",
// "+1 908 739 6797" — validates 10 digits (or 11 with leading 1) and
// normalizes to E.164 (+1XXXXXXXXXX) so GHL SMS/contact matching is reliable.
const usPhone = z
  .string()
  .max(20, "Phone must be less than 20 characters")
  .transform((v) => v.replace(/\D/g, ""))
  .refine(
    (digits) => digits.length === 10 || (digits.length === 11 && digits.startsWith("1")),
    "Enter a valid 10-digit US phone number"
  )
  .transform((digits) => `+1${digits.slice(-10)}`);

const cleanEmail = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

export const ValuationFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: cleanEmail,
  phone: usPhone,
  street: z.string().min(3).max(200),
  city: z.string().min(2).max(100),
  state: z.string().length(2),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/),
  lat: z.number().optional(),
  lng: z.number().optional(),
  address: z.string().optional(),
  pageUrl: z.string().url().optional(),
});

export type ValuationFormData = z.infer<typeof ValuationFormSchema>;

export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: cleanEmail,
  phone: usPhone,
  message: z.string().min(10, "Message must be at least 10 characters").max(500, "Message must be less than 500 characters"),
  serviceType: z.enum(["inherited-property", "foreclosure", "sell-as-is", "general"], {
    errorMap: () => ({ message: "Please select a valid service type" }),
  }),
  source: z.string().optional(),
  referrer: z.string().optional(),
  recaptchaToken: z.string().optional(),
  // Invalid values are dropped (not rejected) — a mangled cid must never block a lead submission
  ghlContactId: z.string().regex(/^[A-Za-z0-9]{15,30}$/).optional().catch(undefined),
  campaign: z.string().max(50).optional().catch(undefined),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
