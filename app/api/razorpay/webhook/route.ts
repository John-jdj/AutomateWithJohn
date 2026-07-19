import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { markPaymentSuccess, markPaymentFailed } from "@/lib/payments";

// Razorpay webhook — the authoritative source of truth for payment status.
// Configure this URL (…/api/razorpay/webhook) in the Razorpay dashboard
// with RAZORPAY_WEBHOOK_SECRET as the signing secret.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const paymentEntity = event.payload?.payment?.entity;

  if (paymentEntity?.order_id) {
    if (event.event === "payment.captured") {
      await markPaymentSuccess(paymentEntity.order_id, paymentEntity.id, paymentEntity.method);
    } else if (event.event === "payment.failed") {
      await markPaymentFailed(paymentEntity.order_id);
    }
  }

  return NextResponse.json({ received: true });
}
