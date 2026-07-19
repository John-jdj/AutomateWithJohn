"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serviceSchema, type ServiceInput } from "@/lib/validations/services";

export type ServiceActionResult = { ok: true } | { ok: false; error: string };

function parseList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function createService(input: ServiceInput): Promise<ServiceActionResult> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const existing = await prisma.service.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { ok: false, error: "That slug is already in use." };

  await prisma.service.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      icon: parsed.data.icon || null,
      features: parseList(parsed.data.features),
      priceFrom: parsed.data.priceFrom ? Number(parsed.data.priceFrom) : null,
      category: parsed.data.category || null,
      order: parsed.data.order ? parseInt(parsed.data.order, 10) : 0,
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true };
}

export async function updateService(
  id: string,
  input: ServiceInput,
): Promise<ServiceActionResult> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const existing = await prisma.service.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) return { ok: false, error: "That slug is already in use." };

  await prisma.service.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      icon: parsed.data.icon || null,
      features: parseList(parsed.data.features),
      priceFrom: parsed.data.priceFrom ? Number(parsed.data.priceFrom) : null,
      category: parsed.data.category || null,
      order: parsed.data.order ? parseInt(parsed.data.order, 10) : 0,
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true };
}

export async function deleteService(id: string): Promise<void> {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  revalidatePath("/services");
}
