"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resend, fromEmail } from "@/lib/resend";
import { invoiceEmail } from "@/lib/emails/invoice";
import { invoiceSchema, type InvoiceInput } from "@/lib/validations/invoices";

export type InvoiceActionResult = { ok: true; id?: string } | { ok: false; error: string };

function toNumericItems(items: InvoiceInput["items"]) {
  return items.map((item) => ({
    description: item.description,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
  }));
}

function computeAmount(items: { quantity: number; unitPrice: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

async function nextInvoiceNumber(): Promise<string> {
  const count = await prisma.invoice.count();
  return `INV-${String(count + 1).padStart(4, "0")}`;
}

export async function createInvoice(input: InvoiceInput): Promise<InvoiceActionResult> {
  await requireAdmin();
  const parsed = invoiceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const items = toNumericItems(parsed.data.items);
  const amount = computeAmount(items);
  const number = await nextInvoiceNumber();

  const invoice = await prisma.invoice.create({
    data: {
      number,
      amount,
      status: "DRAFT",
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      items,
      clientId: parsed.data.clientId,
      projectId: parsed.data.projectId || null,
    },
  });

  revalidatePath("/admin/invoices");
  return { ok: true, id: invoice.id };
}

export async function updateInvoice(id: string, input: InvoiceInput): Promise<InvoiceActionResult> {
  await requireAdmin();
  const parsed = invoiceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const items = toNumericItems(parsed.data.items);
  const amount = computeAmount(items);

  await prisma.invoice.update({
    where: { id },
    data: {
      amount,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      items,
      clientId: parsed.data.clientId,
      projectId: parsed.data.projectId || null,
    },
  });

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
  return { ok: true };
}

export async function setInvoiceStatus(
  id: string,
  status: "DRAFT" | "SENT" | "CANCELLED",
): Promise<void> {
  await requireAdmin();
  const existing = await prisma.invoice.findUniqueOrThrow({ where: { id } });

  const invoice = await prisma.invoice.update({
    where: { id },
    data: { status },
    include: { client: { include: { user: { select: { name: true, email: true } } } } },
  });

  if (resend && existing.status !== "SENT" && status === "SENT") {
    const { subject, html, text } = invoiceEmail({
      clientName: invoice.client.company || invoice.client.user.name || invoice.client.user.email,
      invoiceNumber: invoice.number,
      amount: Number(invoice.amount),
      currency: invoice.currency,
      invoiceId: invoice.id,
    });
    await resend.emails.send({ from: fromEmail, to: invoice.client.user.email, subject, html, text });
  }

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
}

export async function deleteInvoice(id: string): Promise<InvoiceActionResult> {
  await requireAdmin();
  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/admin/invoices");
  return { ok: true };
}
