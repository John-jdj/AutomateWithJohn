import { notFound } from "next/navigation";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ id: string }> };

export default async function PortalInvoiceDetailPage({ params }: Props) {
  const { client } = await requireClient();
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { project: { select: { title: true } } },
  });
  if (!invoice || invoice.clientId !== client.id || invoice.status === "DRAFT") notFound();

  const items = invoice.items as unknown as { description: string; quantity: number; unitPrice: number }[];

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{invoice.number}</h1>
          {invoice.project ? (
            <p className="mt-1 text-sm text-muted-foreground">{invoice.project.title}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Badge>{invoice.status}</Badge>
          <Button
            variant="outline"
            size="sm"
            render={<a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer" />}
            nativeButton={false}
          >
            Download PDF
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span>
              {item.description} × {item.quantity}
            </span>
            <span>₹{(item.quantity * item.unitPrice).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1 border-t border-border/60 pt-4 text-sm">
        <p className="font-medium">Total: ₹{Number(invoice.amount).toFixed(2)}</p>
      </div>
    </div>
  );
}
