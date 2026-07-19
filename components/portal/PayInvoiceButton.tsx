"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPaymentOrder, confirmPayment } from "@/app/portal/invoices/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function PayInvoiceButton({
  invoiceId,
  invoiceNumber,
  due,
}: {
  invoiceId: string;
  invoiceNumber: string;
  due: number;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(due.toFixed(2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setError(null);
    setLoading(true);
    try {
      const numericAmount = Number(amount);
      if (!numericAmount || numericAmount <= 0) {
        setError("Enter a valid amount.");
        return;
      }

      const orderResult = await createPaymentOrder(invoiceId, numericAmount);
      if (!orderResult.ok) {
        setError(orderResult.error);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Could not load the payment provider. Check your connection and try again.");
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderResult.keyId,
        amount: orderResult.amount,
        currency: orderResult.currency,
        order_id: orderResult.orderId,
        name: "AutomateWithJohn",
        description: `Invoice ${invoiceNumber}`,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const confirmResult = await confirmPayment({
            invoiceId,
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          if (!confirmResult.ok) {
            setError(confirmResult.error);
          }
          router.refresh();
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      razorpay.open();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-border/60 p-4">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setAmount(due.toFixed(2))}>
          Pay in full (₹{due.toFixed(2)})
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setAmount((due / 2).toFixed(2))}
        >
          Pay 50% advance
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pay-amount">Amount to pay (₹)</Label>
        <Input
          id="pay-amount"
          type="number"
          min="0.01"
          max={due}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="button" disabled={loading} onClick={pay}>
        {loading ? "Opening payment…" : "Pay now"}
      </Button>
    </div>
  );
}
