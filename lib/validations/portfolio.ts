import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(slugPattern, "Use lowercase letters, numbers, and hyphens only"),
  summary: z.string().min(1, "Summary is required").max(500),
  description: z.string().min(1, "Description is required"),
  images: z.string().max(2000).optional().or(z.literal("")), // comma-separated URLs in the form
  videoUrl: z.string().url().optional().or(z.literal("")),
  techStack: z.string().max(500).optional().or(z.literal("")), // comma-separated in the form
  category: z.string().min(1, "Category is required").max(100),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  clientId: z.string().optional().or(z.literal("")),
  featured: z.boolean().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const caseStudySchema = z.object({
  challenge: z.string().min(1, "Challenge is required"),
  solution: z.string().min(1, "Solution is required"),
  results: z.string().min(1, "Results are required"),
  metrics: z.string().max(2000).optional().or(z.literal("")), // raw JSON text, validated on submit
});

export type CaseStudyInput = z.infer<typeof caseStudySchema>;
