"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";

export type SettingsActionResult = { ok: true } | { ok: false; error: string };

const SETTINGS_ID = "singleton";

export async function updateSettings(input: SettingsInput): Promise<SettingsActionResult> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const socialLinks = {
    twitter: parsed.data.twitter || undefined,
    linkedin: parsed.data.linkedin || undefined,
    github: parsed.data.github || undefined,
    instagram: parsed.data.instagram || undefined,
  };

  await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    create: {
      id: SETTINGS_ID,
      siteName: parsed.data.siteName,
      siteDescription: parsed.data.siteDescription || null,
      contactEmail: parsed.data.contactEmail || null,
      contactPhone: parsed.data.contactPhone || null,
      socialLinks,
    },
    update: {
      siteName: parsed.data.siteName,
      siteDescription: parsed.data.siteDescription || null,
      contactEmail: parsed.data.contactEmail || null,
      contactPhone: parsed.data.contactPhone || null,
      socialLinks,
    },
  });

  revalidatePath("/admin/settings");
  return { ok: true };
}
