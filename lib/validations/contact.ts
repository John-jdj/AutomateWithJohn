import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().max(50).optional().or(z.literal("")),
  subject: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)").max(5000),
  recaptchaToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const consultationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().max(50).optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  topic: z.string().min(1, "Select a topic"),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)").max(5000),
  recaptchaToken: z.string().optional(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
