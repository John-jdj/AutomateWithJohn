"use server";

import { revalidatePath } from "next/cache";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay, verifyCheckoutSignature } from "@/lib/razorpay";
import { markPaymentSuccess } from "@/lib/payments";

export type CreateOrderResult =
  | { ok: true; orderId: string; amount: number; currency: string; keyId: string }
  | { ok: false; error: string };

export async function createPaymentOrder(invoiceId: string, amount: number): Promise<CreateOrderResult> {
  const { client } = await requireClient();

  if (!razorpay || !process.env.RAZORPAY_KEY_ID) {
    return { ok: false, error: "Payments aren't configured yet. Please contact us to pay this invoice." };
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: { where: { status: "SUCCESS" } } },
  });
  if (!invoice || invoice.clientId !== client.id) {
    return { ok: false, error: "Invoice not found." };
  }
  if (invoice.status === "CANCELLED") {
    return { ok: false, error: "This invoice has been cancelled." };
  }

  const paid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const due = Number(invoice.amount) - paid;
  if (amount <= 0 || amount > due + 0.01) {
    return { ok: false, error: "Enter an amount up to the remaining balance." };
  }

  const amountPaise = Math.round(amount * 100);
  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: invoice.currency,
    receipt: `${invoice.number}-${Date.now()}`,
  });

  await prisma.payment.create({
    data: {
      amount,
      currency: invoice.currency,
      status: "PENDING",
      razorpayOrderId: order.id,
      invoiceId: invoice.id,
    },
  });

  return {
    ok: true,
    orderId: order.id,
    amount: amountPaise,
    currency: invoice.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  };
}

export type ConfirmPaymentResult = { ok: true } | { ok: false; error: string };

export async function confirmPayment(params: {
  invoiceId: string;
  orderId: string;
  paymentId: string;
  signature: string;
}): Promise<ConfirmPaymentResult> {
  await requireClient();

  const valid = verifyCheckoutSignature({
    orderId: params.orderId,
    paymentId: params.paymentId,
    signature: params.signature,
  });
  if (!valid) {
    return { ok: false, error: "Could not verify payment. It will be confirmed shortly if valid." };
  }

  await markPaymentSuccess(params.orderId, params.paymentId);
  revalidatePath(`/portal/invoices/${params.invoiceId}`);
  revalidatePath("/portal");
  return { ok: true };
}
