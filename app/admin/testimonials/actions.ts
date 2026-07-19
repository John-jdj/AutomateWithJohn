"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations/testimonials";

export type TestimonialActionResult = { ok: true } | { ok: false; error: string };

function clampRating(value: string | undefined): number {
  const n = value ? parseInt(value, 10) : 5;
  if (Number.isNaN(n)) return 5;
  return Math.min(5, Math.max(1, n));
}

export async function createTestimonial(
  input: TestimonialInput,
): Promise<TestimonialActionResult> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await prisma.testimonial.create({
    data: {
      clientName: parsed.data.clientName,
      clientRole: parsed.data.clientRole || null,
      company: parsed.data.company || null,
      avatar: parsed.data.avatar || null,
      content: parsed.data.content,
      rating: clampRating(parsed.data.rating),
      featured: parsed.data.featured ?? false,
      clientId: parsed.data.clientId || null,
      projectId: parsed.data.projectId || null,
    },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  return { ok: true };
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput,
): Promise<TestimonialActionResult> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await prisma.testimonial.update({
    where: { id },
    data: {
      clientName: parsed.data.clientName,
      clientRole: parsed.data.clientRole || null,
      company: parsed.data.company || null,
      avatar: parsed.data.avatar || null,
      content: parsed.data.content,
      rating: clampRating(parsed.data.rating),
      featured: parsed.data.featured ?? false,
      clientId: parsed.data.clientId || null,
      projectId: parsed.data.projectId || null,
    },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  return { ok: true };
}

export async function deleteTestimonial(id: string): Promise<void> {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
}
