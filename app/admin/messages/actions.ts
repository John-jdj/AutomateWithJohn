"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function setMessageStatus(
  id: string,
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED",
): Promise<void> {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string): Promise<void> {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
