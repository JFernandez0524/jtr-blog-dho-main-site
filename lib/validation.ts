import { z } from "zod";

export const ValuationFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
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
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters").max(15, "Phone must be less than 15 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(500, "Message must be less than 500 characters"),
  serviceType: z.enum(["inherited-property", "foreclosure", "sell-as-is", "general"], {
    errorMap: () => ({ message: "Please select a valid service type" }),
  }),
  source: z.string().optional(),
  referrer: z.string().optional(),
  recaptchaToken: z.string().optional(),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
