import { prisma } from "@/lib/prisma";

// Shared by both the checkout-success verification (fast, optimistic) and
// the Razorpay webhook (authoritative). Idempotent — safe to call twice
// for the same payment, which happens whenever both paths fire.
export async function markPaymentSuccess(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  method?: string,
) {
  const payment = await prisma.payment.findFirst({ where: { razorpayOrderId } });
  if (!payment) return null;
  if (payment.status === "SUCCESS") return payment;

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "SUCCESS", razorpayPaymentId, method },
  });

  const invoice = await prisma.invoice.findUnique({
    where: { id: updated.invoiceId },
    include: { payments: { where: { status: "SUCCESS" } } },
  });
  if (invoice) {
    const paid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    if (paid >= Number(invoice.amount) && invoice.status !== "PAID") {
      await prisma.invoice.update({ where: { id: invoice.id }, data: { status: "PAID" } });
    } else if (invoice.status === "DRAFT") {
      await prisma.invoice.update({ where: { id: invoice.id }, data: { status: "SENT" } });
    }
  }

  return updated;
}

export async function markPaymentFailed(razorpayOrderId: string) {
  const payment = await prisma.payment.findFirst({ where: { razorpayOrderId } });
  if (!payment || payment.status === "SUCCESS") return payment;
  return prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
}
