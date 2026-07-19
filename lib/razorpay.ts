import Razorpay from "razorpay";
import crypto from "crypto";

// Guarded: Razorpay keys aren't set yet in this environment. Callers must
// check `razorpay` for null and fail soft with a clear message — never
// fabricate a successful payment.
export const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

// Verifies the signature Razorpay's Checkout returns to the browser after
// a successful payment. This is a fast, optimistic confirmation — the
// webhook (verifyWebhookSignature) remains the authoritative source of
// truth since this check runs on data the client could tamper with.
export function verifyCheckoutSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!process.env.RAZORPAY_KEY_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");
  return expected === params.signature;
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return expected === signature;
}
