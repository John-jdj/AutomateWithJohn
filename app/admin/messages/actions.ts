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

export type ConvertMessageResult = { ok: true } | { ok: false; error: string };

export async function convertMessageToLead(id: string): Promise<ConvertMessageResult> {
  await requireAdmin();

  const message = await prisma.contactMessage.findUnique({
    where: { id },
    include: { convertedToLead: true },
  });
  if (!message) return { ok: false, error: "Message not found." };
  if (message.convertedToLead) return { ok: false, error: "This message was already converted." };

  await prisma.$transaction([
    prisma.lead.create({
      data: {
        name: message.name,
        email: message.email,
        phone: message.phone,
        notes: message.content,
        source: "contact_message",
        sourceMessageId: message.id,
      },
    }),
    prisma.contactMessage.update({ where: { id }, data: { status: "REPLIED" } }),
  ]);

  revalidatePath("/admin/messages");
  revalidatePath("/admin/leads");
  return { ok: true };
}
