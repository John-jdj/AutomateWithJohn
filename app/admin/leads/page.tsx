import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stageVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  NEW: "secondary",
  CONTACTED: "outline",
  QUALIFIED: "outline",
  PROPOSAL_SENT: "outline",
  NEGOTIATION: "outline",
  WON: "default",
  LOST: "destructive",
};

export default async function AdminLeadsPage() {
  await requireAdmin();
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { convertedClient: { select: { id: true } } },
  });

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <Button render={<Link href="/admin/leads/new" />} nativeButton={false}>
          New lead
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">No leads yet.</p>
        ) : (
          leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/admin/leads/${lead.id}`}
              className="block rounded-lg border border-border/60 p-4 hover:bg-muted/50"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{lead.name}</p>
                <Badge variant={stageVariant[lead.stage] ?? "secondary"}>{lead.stage}</Badge>
                {lead.convertedClient ? <Badge variant="outline">Client</Badge> : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {lead.email} {lead.company ? `· ${lead.company}` : ""}{" "}
                {lead.source ? `· via ${lead.source}` : ""}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
