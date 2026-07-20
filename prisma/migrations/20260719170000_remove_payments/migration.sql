-- Razorpay integration removed (no replacement payment provider). Drops
-- the payments table (including its Razorpay-specific columns) and the
-- PaymentStatus enum. InvoiceStatus keeps PAID/OVERDUE for schema
-- flexibility even though nothing currently sets them.

DROP TABLE "payments";

DROP TYPE "PaymentStatus";
