import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminClientsPage() {
  await requireAdmin();
  const clients = await prisma.client.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { projects: true, invoices: true, tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Clients</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Read-only for now — pipeline stages and lead-to-client conversion arrive in the CRM
        phase.
      </p>

      <div className="mt-8 space-y-3">
        {clients.length === 0 ? (
          <p className="text-sm text-muted-foreground">No clients yet.</p>
        ) : (
          clients.map((client) => (
            <Link
              key={client.id}
              href={`/admin/clients/${client.id}`}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 p-4 hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">{client.company || client.user.name || client.user.email}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {client.user.email} · {client._count.projects} project
                  {client._count.projects === 1 ? "" : "s"} · {client._count.invoices} invoice
                  {client._count.invoices === 1 ? "" : "s"} · {client._count.tasks} task
                  {client._count.tasks === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
