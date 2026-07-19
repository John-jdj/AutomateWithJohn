import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { createInvoice } from "@/app/admin/invoices/actions";

export default async function NewInvoicePage() {
  await requireAdmin();
  const [clients, projects] = await Promise.all([
    prisma.client.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.project.findMany({ select: { id: true, title: true }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">New invoice</h1>
      <div className="mt-8">
        <InvoiceForm
          onSubmit={createInvoice}
          submitLabel="Create invoice"
          clients={clients.map((c) => ({
            id: c.id,
            label: c.company || c.user.name || c.user.email,
          }))}
          projects={projects.map((p) => ({ id: p.id, label: p.title }))}
        />
      </div>
    </div>
  );
}
