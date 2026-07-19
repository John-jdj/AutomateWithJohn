import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  SENT: "outline",
  PAID: "default",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
};

export default async function AdminInvoicesPage() {
  await requireAdmin();
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: { include: { user: { select: { name: true, email: true } } } },
      payments: { where: { status: "SUCCESS" }, select: { amount: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Button render={<Link href="/admin/invoices/new" />} nativeButton={false}>
          New invoice
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invoices yet.</p>
        ) : (
          invoices.map((invoice) => {
            const paid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
            return (
              <Link
                key={invoice.id}
                href={`/admin/invoices/${invoice.id}`}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 p-4 hover:bg-muted/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{invoice.number}</p>
                    <Badge variant={statusVariant[invoice.status] ?? "secondary"}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {invoice.client.company ||
                      invoice.client.user.name ||
                      invoice.client.user.email}{" "}
                    · ₹{Number(invoice.amount).toFixed(2)}
                    {paid > 0 ? ` (₹${paid.toFixed(2)} paid)` : ""}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
