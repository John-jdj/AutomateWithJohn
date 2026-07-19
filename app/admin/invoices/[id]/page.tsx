import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { InvoiceStatusControl } from "@/components/admin/InvoiceStatusControl";
import { updateInvoice } from "@/app/admin/invoices/actions";

type Props = { params: Promise<{ id: string }> };

const paymentStatusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  SUCCESS: "default",
  FAILED: "destructive",
  REFUNDED: "outline",
};

export default async function InvoiceDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const [invoice, clients, projects] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id },
      include: {
        client: { include: { user: { select: { name: true, email: true } } } },
        project: { select: { title: true } },
        payments: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.client.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.project.findMany({ select: { id: true, title: true }, orderBy: { createdAt: "desc" } }),
  ]);
  if (!invoice) notFound();

  const paid = invoice.payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const hasSuccessfulPayment = paid > 0;
  const boundUpdate = updateInvoice.bind(null, invoice.id);

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{invoice.number}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoice.client.company || invoice.client.user.name || invoice.client.user.email}
            {invoice.project ? ` · ${invoice.project.title}` : ""}
          </p>
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
          <InvoiceStatusControl
            id={invoice.id}
            status={invoice.status}
            canDelete={invoice.payments.length === 0}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium">Summary</h2>
          <p className="mt-2 text-sm">Total: ₹{Number(invoice.amount).toFixed(2)}</p>
          <p className="text-sm">Paid: ₹{paid.toFixed(2)}</p>
          <p className="text-sm">Due: ₹{(Number(invoice.amount) - paid).toFixed(2)}</p>
          {invoice.dueDate ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Due date: {invoice.dueDate.toLocaleDateString()}
            </p>
          ) : null}
        </div>

        <div>
          <h2 className="text-sm font-medium">Payments</h2>
          <div className="mt-2 space-y-2">
            {invoice.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            ) : (
              invoice.payments.map((payment) => (
                <div key={payment.id} className="rounded-md border border-border/60 p-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span>₹{Number(payment.amount).toFixed(2)}</span>
                    <Badge variant={paymentStatusVariant[payment.status] ?? "secondary"}>
                      {payment.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {payment.createdAt.toLocaleString()}
                    {payment.razorpayPaymentId ? ` · ${payment.razorpayPaymentId}` : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-border/60 pt-8">
        <h2 className="text-xl font-semibold">Edit invoice</h2>
        {hasSuccessfulPayment ? (
          <p className="mt-2 text-sm text-muted-foreground">
            This invoice has a successful payment and can no longer be edited.
          </p>
        ) : (
          <div className="mt-6">
            <InvoiceForm
              defaultValues={{
                clientId: invoice.clientId,
                projectId: invoice.projectId ?? "",
                dueDate: invoice.dueDate ? invoice.dueDate.toISOString().slice(0, 10) : "",
                items: (
                  invoice.items as unknown as { description: string; quantity: number; unitPrice: number }[]
                ).map((item) => ({
                  description: item.description,
                  quantity: String(item.quantity),
                  unitPrice: String(item.unitPrice),
                })),
              }}
              onSubmit={boundUpdate}
              submitLabel="Save changes"
              clients={clients.map((c) => ({
                id: c.id,
                label: c.company || c.user.name || c.user.email,
              }))}
              projects={projects.map((p) => ({ id: p.id, label: p.title }))}
            />
          </div>
        )}
      </div>

      <p className="mt-8 text-sm">
        <Link href={`/admin/clients/${invoice.clientId}`} className="underline">
          View client →
        </Link>
      </p>
    </div>
  );
}
