"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type UserActionResult = { ok: true } | { ok: false; error: string };

export async function setUserRole(
  id: string,
  role: "ADMIN" | "CLIENT",
): Promise<UserActionResult> {
  const admin = await requireAdmin();

  if (id === admin.id && role !== "ADMIN") {
    return { ok: false, error: "You can't remove your own admin access." };
  }

  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin/users");
  return { ok: true };
}
