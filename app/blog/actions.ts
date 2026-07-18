"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { commentSchema, type CommentInput } from "@/lib/validations/blog";

export type CommentActionResult = { ok: true } | { ok: false; error: string };

export async function submitComment(
  postId: string,
  postSlug: string,
  input: CommentInput,
): Promise<CommentActionResult> {
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const humanVerified = await verifyRecaptcha(parsed.data.recaptchaToken);
  if (!humanVerified) {
    return { ok: false, error: "We couldn't verify you're human. Please try again." };
  }

  await prisma.comment.create({
    data: {
      authorName: parsed.data.authorName,
      authorEmail: parsed.data.authorEmail,
      content: parsed.data.content,
      postId,
    },
  });

  revalidatePath(`/blog/${postSlug}`);
  return { ok: true };
}
