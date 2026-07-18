"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations/blog";

export type BlogActionResult = { ok: true } | { ok: false; error: string };

function parseTags(tags: string | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function createPost(input: BlogPostInput): Promise<BlogActionResult> {
  const admin = await requireAdmin();
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const existing = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { ok: false, error: "That slug is already in use." };

  await prisma.blogPost.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage || null,
      tags: parseTags(parsed.data.tags),
      category: parsed.data.category || null,
      seoTitle: parsed.data.seoTitle || null,
      seoDescription: parsed.data.seoDescription || null,
      authorId: admin.id,
    },
  });

  revalidatePath("/admin/blog");
  return { ok: true };
}

export async function updatePost(id: string, input: BlogPostInput): Promise<BlogActionResult> {
  await requireAdmin();
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const existing = await prisma.blogPost.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) return { ok: false, error: "That slug is already in use." };

  await prisma.blogPost.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage || null,
      tags: parseTags(parsed.data.tags),
      category: parsed.data.category || null,
      seoTitle: parsed.data.seoTitle || null,
      seoDescription: parsed.data.seoDescription || null,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  return { ok: true };
}

export async function deletePost(id: string): Promise<void> {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
}

export async function setPostStatus(id: string, status: "DRAFT" | "PUBLISHED"): Promise<void> {
  await requireAdmin();
  const post = await prisma.blogPost.findUniqueOrThrow({ where: { id } });

  await prisma.blogPost.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? (post.publishedAt ?? new Date()) : post.publishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/blog");
}

export async function moderateComment(
  id: string,
  status: "APPROVED" | "SPAM",
): Promise<void> {
  await requireAdmin();
  const comment = await prisma.comment.update({
    where: { id },
    data: { status },
    include: { post: true },
  });
  revalidatePath("/admin/blog/comments");
  revalidatePath(`/blog/${comment.post.slug}`);
}

export async function deleteComment(id: string): Promise<void> {
  await requireAdmin();
  await prisma.comment.delete({ where: { id } });
  revalidatePath("/admin/blog/comments");
}
