import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().max(50).optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  source: z.string().max(100).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const pipelineStages = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const;

export type PipelineStageValue = (typeof pipelineStages)[number];
