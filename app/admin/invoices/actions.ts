"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  const existingPayment = await prisma.payment.findFirst({
    where: { invoiceId: id, status: "SUCCESS" },
  });
  if (existingPayment) {
    return { ok: false, error: "Can't edit an invoice that already has a successful payment." };
  }

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
  await prisma.invoice.update({ where: { id }, data: { status } });
  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
}

export async function deleteInvoice(id: string): Promise<InvoiceActionResult> {
  await requireAdmin();
  const payments = await prisma.payment.count({ where: { invoiceId: id } });
  if (payments > 0) {
    return { ok: false, error: "Can't delete an invoice with payment history." };
  }
  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/admin/invoices");
  return { ok: true };
}
