import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

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
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Leads</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Read-only for now — pipeline stage management and client conversion arrive in the CRM
        phase.
      </p>

      <div className="mt-8 space-y-3">
        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">No leads yet.</p>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="rounded-lg border border-border/60 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{lead.name}</p>
                <Badge variant={stageVariant[lead.stage] ?? "secondary"}>{lead.stage}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {lead.email} {lead.company ? `· ${lead.company}` : ""}{" "}
                {lead.source ? `· via ${lead.source}` : ""}
              </p>
              {lead.notes ? <p className="mt-2 text-sm">{lead.notes}</p> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
