import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required").max(300),
  quantity: z
    .string()
    .min(1, "Required")
    .refine((v) => Number(v) > 0, "Must be greater than 0"),
  unitPrice: z
    .string()
    .min(1, "Required")
    .refine((v) => Number(v) >= 0, "Must be 0 or greater"),
});

export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;

export const invoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  projectId: z.string().optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
  items: z.array(invoiceItemSchema).min(1, "Add at least one line item"),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
