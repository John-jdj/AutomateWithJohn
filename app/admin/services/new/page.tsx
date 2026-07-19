import { requireAdmin } from "@/lib/auth";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { createService } from "@/app/admin/services/actions";

export default async function NewServicePage() {
  await requireAdmin();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">New service</h1>
      <div className="mt-8">
        <ServiceForm onSubmit={createService} submitLabel="Create service" />
      </div>
    </div>
  );
}
