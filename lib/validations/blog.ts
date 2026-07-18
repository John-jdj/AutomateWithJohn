import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(slugPattern, "Use lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url().optional().or(z.literal("")),
  tags: z.string().max(500).optional().or(z.literal("")), // comma-separated in the form
  category: z.string().max(100).optional().or(z.literal("")),
  seoTitle: z.string().max(200).optional().or(z.literal("")),
  seoDescription: z.string().max(300).optional().or(z.literal("")),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

export const commentSchema = z.object({
  authorName: z.string().min(1, "Name is required").max(200),
  authorEmail: z.string().email("Enter a valid email address"),
  content: z.string().min(1, "Comment can't be empty").max(3000),
  recaptchaToken: z.string().optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;
