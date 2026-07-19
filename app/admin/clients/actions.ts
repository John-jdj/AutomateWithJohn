"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { taskSchema, meetingNoteSchema, type TaskInput, type MeetingNoteInput } from "@/lib/validations/tasks";

export type ClientActionResult = { ok: true } | { ok: false; error: string };

export async function createTask(clientId: string, input: TaskInput): Promise<ClientActionResult> {
  const admin = await requireAdmin();
  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      clientId,
      assignedToId: parsed.data.assignedToId || admin.id,
    },
  });

  revalidatePath(`/admin/clients/${clientId}`);
  return { ok: true };
}

export async function setTaskStatus(
  clientId: string,
  taskId: string,
  status: "TODO" | "IN_PROGRESS" | "DONE",
): Promise<void> {
  await requireAdmin();
  await prisma.task.update({ where: { id: taskId }, data: { status } });
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function deleteTask(clientId: string, taskId: string): Promise<void> {
  await requireAdmin();
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function createMeetingNote(
  clientId: string,
  input: MeetingNoteInput,
): Promise<ClientActionResult> {
  const admin = await requireAdmin();
  const parsed = meetingNoteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await prisma.meetingNote.create({
    data: {
      title: parsed.data.title,
      notes: parsed.data.notes,
      meetingDate: new Date(parsed.data.meetingDate),
      clientId,
      createdById: admin.id,
    },
  });

  revalidatePath(`/admin/clients/${clientId}`);
  return { ok: true };
}

export async function deleteMeetingNote(clientId: string, noteId: string): Promise<void> {
  await requireAdmin();
  await prisma.meetingNote.delete({ where: { id: noteId } });
  revalidatePath(`/admin/clients/${clientId}`);
}
