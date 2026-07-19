"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { leadSchema, pipelineStages, type LeadInput, type PipelineStageValue } from "@/lib/validations/leads";

export type LeadActionResult = { ok: true } | { ok: false; error: string };

export async function createLead(input: LeadInput): Promise<LeadActionResult> {
  await requireAdmin();
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await prisma.lead.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      notes: parsed.data.notes || null,
      source: parsed.data.source || "manual",
    },
  });

  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function updateLead(id: string, input: LeadInput): Promise<LeadActionResult> {
  await requireAdmin();
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await prisma.lead.update({
    where: { id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      notes: parsed.data.notes || null,
      source: parsed.data.source || null,
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true };
}

export async function setLeadStage(id: string, stage: PipelineStageValue): Promise<void> {
  await requireAdmin();
  if (!pipelineStages.includes(stage)) return;
  await prisma.lead.update({ where: { id }, data: { stage } });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function deleteLead(id: string): Promise<void> {
  await requireAdmin();
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
}

export async function convertLeadToClient(id: string): Promise<LeadActionResult> {
  await requireAdmin();

  const lead = await prisma.lead.findUnique({ where: { id }, include: { convertedClient: true } });
  if (!lead) return { ok: false, error: "Lead not found." };
  if (lead.convertedClient) return { ok: false, error: "This lead has already been converted." };

  let user = await prisma.user.findUnique({ where: { email: lead.email } });

  if (!user) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(lead.email, {
      data: { name: lead.name },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    });
    if (error || !data.user) {
      return { ok: false, error: error?.message ?? "Failed to invite the lead by email." };
    }

    // The auth.users -> public.users sync trigger fires synchronously on
    // insert, but poll briefly in case of replication lag.
    for (let attempt = 0; attempt < 5 && !user; attempt++) {
      user = await prisma.user.findUnique({ where: { authId: data.user.id } });
      if (!user) await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (!user) return { ok: false, error: "Account created but not yet synced. Try again shortly." };
  }

  const existingClient = await prisma.client.findUnique({ where: { userId: user.id } });
  if (existingClient) return { ok: false, error: "That email is already linked to a client account." };

  await prisma.$transaction([
    prisma.client.create({
      data: {
        userId: user.id,
        company: lead.company,
        phone: lead.phone,
        convertedFromLeadId: lead.id,
      },
    }),
    prisma.lead.update({ where: { id }, data: { stage: "WON" } }),
    // Don't touch role if this account happens to already be an admin.
    ...(user.role === "ADMIN"
      ? []
      : [prisma.user.update({ where: { id: user.id }, data: { role: "CLIENT" as const } })]),
  ]);

  revalidatePath("/admin/leads");
  revalidatePath("/admin/clients");
  return { ok: true };
}
