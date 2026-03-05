import { z } from "zod";

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
