import Link from "next/link";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  SENT: "outline",
  PAID: "default",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
};

export default async function PortalHomePage() {
  const { client } = await requireClient();

  const invoices = await prisma.invoice.findMany({
    where: { clientId: client.id, status: { not: "DRAFT" } },
    orderBy: { createdAt: "desc" },
    include: { payments: { where: { status: "SUCCESS" }, select: { amount: true } } },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Your invoices</h1>

      <div className="mt-8 space-y-3">
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invoices yet.</p>
        ) : (
          invoices.map((invoice) => {
            const paid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
            const due = Number(invoice.amount) - paid;
            return (
              <Link
                key={invoice.id}
                href={`/portal/invoices/${invoice.id}`}
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
                    Total ₹{Number(invoice.amount).toFixed(2)}
                    {due > 0 ? ` · ₹${due.toFixed(2)} due` : " · fully paid"}
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
