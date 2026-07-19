import { requireAdmin } from "@/lib/auth";
import { LeadForm } from "@/components/admin/LeadForm";
import { createLead } from "@/app/admin/leads/actions";

export default async function NewLeadPage() {
  await requireAdmin();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">New lead</h1>
      <div className="mt-8">
        <LeadForm onSubmit={createLead} submitLabel="Create lead" redirectTo="/admin/leads" />
      </div>
    </div>
  );
}
