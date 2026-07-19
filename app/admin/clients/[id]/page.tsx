import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { TaskSection } from "@/components/admin/TaskSection";
import { MeetingNoteSection } from "@/components/admin/MeetingNoteSection";

type Props = { params: Promise<{ id: string }> };

export default async function AdminClientDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      convertedFromLead: { select: { id: true, name: true } },
      projects: { select: { id: true, title: true, slug: true, publishedAt: true } },
      invoices: { select: { id: true, number: true, amount: true, status: true } },
      tasks: {
        select: { id: true, title: true, description: true, status: true, dueDate: true },
        orderBy: { createdAt: "desc" },
      },
      meetingNotes: {
        select: { id: true, title: true, notes: true, meetingDate: true },
        orderBy: { meetingDate: "desc" },
      },
    },
  });
  if (!client) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">
        {client.company || client.user.name || client.user.email}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {client.user.email} {client.phone ? `· ${client.phone}` : ""}
      </p>
      {client.convertedFromLead ? (
        <p className="mt-1 text-xs text-muted-foreground">
          Converted from lead: {client.convertedFromLead.name}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-sm font-medium">Projects</h2>
          <div className="mt-2 space-y-2">
            {client.projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">None</p>
            ) : (
              client.projects.map((p) => (
                <div key={p.id} className="rounded-md border border-border/60 p-2 text-sm">
                  {p.title}
                  <Badge variant={p.publishedAt ? "default" : "secondary"} className="ml-2">
                    {p.publishedAt ? "PUBLISHED" : "DRAFT"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium">Invoices</h2>
          <div className="mt-2 space-y-2">
            {client.invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">None</p>
            ) : (
              client.invoices.map((inv) => (
                <div key={inv.id} className="rounded-md border border-border/60 p-2 text-sm">
                  {inv.number} — {inv.amount.toString()}
                  <Badge variant="secondary" className="ml-2">
                    {inv.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <TaskSection clientId={client.id} tasks={client.tasks} />
        <MeetingNoteSection clientId={client.id} meetingNotes={client.meetingNotes} />
      </div>
    </div>
  );
}
