"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@/lib/generated/prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  projectSchema,
  caseStudySchema,
  type ProjectInput,
  type CaseStudyInput,
} from "@/lib/validations/portfolio";

export type PortfolioActionResult = { ok: true } | { ok: false; error: string };

function parseList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function createProject(input: ProjectInput): Promise<PortfolioActionResult> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { ok: false, error: "That slug is already in use." };

  await prisma.project.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      description: parsed.data.description,
      images: parseList(parsed.data.images),
      videoUrl: parsed.data.videoUrl || null,
      techStack: parseList(parsed.data.techStack),
      category: parsed.data.category,
      githubUrl: parsed.data.githubUrl || null,
      liveUrl: parsed.data.liveUrl || null,
      clientId: parsed.data.clientId || null,
      featured: parsed.data.featured ?? false,
    },
  });

  revalidatePath("/admin/portfolio");
  return { ok: true };
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<PortfolioActionResult> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const existing = await prisma.project.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) return { ok: false, error: "That slug is already in use." };

  await prisma.project.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      description: parsed.data.description,
      images: parseList(parsed.data.images),
      videoUrl: parsed.data.videoUrl || null,
      techStack: parseList(parsed.data.techStack),
      category: parsed.data.category,
      githubUrl: parsed.data.githubUrl || null,
      liveUrl: parsed.data.liveUrl || null,
      clientId: parsed.data.clientId || null,
      featured: parsed.data.featured ?? false,
    },
  });

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${parsed.data.slug}`);
  return { ok: true };
}

export async function deleteProject(id: string): Promise<void> {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}

export async function setProjectPublished(id: string, published: boolean): Promise<void> {
  await requireAdmin();
  const project = await prisma.project.findUniqueOrThrow({ where: { id } });

  await prisma.project.update({
    where: { id },
    data: {
      publishedAt: published ? (project.publishedAt ?? new Date()) : null,
    },
  });

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${project.slug}`);
}

export async function upsertCaseStudy(
  projectId: string,
  input: CaseStudyInput,
): Promise<PortfolioActionResult> {
  await requireAdmin();
  const parsed = caseStudySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  let metrics: Prisma.InputJsonValue | undefined = undefined;
  if (parsed.data.metrics) {
    try {
      metrics = JSON.parse(parsed.data.metrics) as Prisma.InputJsonValue;
    } catch {
      return { ok: false, error: "Metrics must be valid JSON, e.g. {\"conversionLift\": \"34%\"}" };
    }
  }

  const project = await prisma.project.findUniqueOrThrow({ where: { id: projectId } });

  await prisma.caseStudy.upsert({
    where: { projectId },
    create: {
      projectId,
      challenge: parsed.data.challenge,
      solution: parsed.data.solution,
      results: parsed.data.results,
      metrics,
    },
    update: {
      challenge: parsed.data.challenge,
      solution: parsed.data.solution,
      results: parsed.data.results,
      metrics,
    },
  });

  revalidatePath("/admin/portfolio");
  revalidatePath(`/portfolio/${project.slug}`);
  return { ok: true };
}

export async function deleteCaseStudy(projectId: string): Promise<void> {
  await requireAdmin();
  const project = await prisma.project.findUniqueOrThrow({ where: { id: projectId } });
  await prisma.caseStudy.delete({ where: { projectId } });
  revalidatePath("/admin/portfolio");
  revalidatePath(`/portfolio/${project.slug}`);
}
