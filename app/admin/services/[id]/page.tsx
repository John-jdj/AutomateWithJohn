import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { updateService } from "@/app/admin/services/actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  const boundUpdate = updateService.bind(null, service.id);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Edit service</h1>
      <div className="mt-8">
        <ServiceForm
          defaultValues={{
            title: service.title,
            slug: service.slug,
            description: service.description,
            icon: service.icon ?? "",
            features: service.features.join(", "),
            priceFrom: service.priceFrom?.toString() ?? "",
            category: service.category ?? "",
            order: service.order.toString(),
          }}
          onSubmit={boundUpdate}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
