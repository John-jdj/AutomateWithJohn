import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LeadForm } from "@/components/admin/LeadForm";
import { LeadStageControl } from "@/components/admin/LeadStageControl";
import { updateLead } from "@/app/admin/leads/actions";

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { convertedClient: { select: { id: true } }, sourceMessage: true },
  });
  if (!lead) notFound();

  const boundUpdate = updateLead.bind(null, lead.id);

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{lead.name}</h1>
        <LeadStageControl id={lead.id} stage={lead.stage} alreadyConverted={Boolean(lead.convertedClient)} />
      </div>

      {lead.convertedClient ? (
        <p className="mt-2 text-sm">
          <Link href={`/admin/clients/${lead.convertedClient.id}`} className="underline">
            View client account →
          </Link>
        </p>
      ) : null}

      {lead.sourceMessage ? (
        <div className="mt-4 rounded-md border border-border/60 p-3 text-sm">
          <p className="font-medium">Original message</p>
          <p className="mt-1 text-muted-foreground">{lead.sourceMessage.content}</p>
        </div>
      ) : null}

      <div className="mt-8">
        <LeadForm
          defaultValues={{
            name: lead.name,
            email: lead.email,
            phone: lead.phone ?? "",
            company: lead.company ?? "",
            notes: lead.notes ?? "",
            source: lead.source ?? "",
          }}
          onSubmit={boundUpdate}
          submitLabel="Save changes"
          redirectTo="/admin/leads"
        />
      </div>
    </div>
  );
}
