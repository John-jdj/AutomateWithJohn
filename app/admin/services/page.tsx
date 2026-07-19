import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ServiceRowActions } from "@/components/admin/ServiceRowActions";

export default async function AdminServicesPage() {
  await requireAdmin();
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Services</h1>
        <Button render={<Link href="/admin/services/new" />} nativeButton={false}>
          New service
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {services.length === 0 ? (
          <p className="text-sm text-muted-foreground">No services yet.</p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 p-4"
            >
              <div>
                <Link href={`/admin/services/${service.id}`} className="font-medium underline">
                  {service.title}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  /{service.slug} · order {service.order}
                  {service.priceFrom ? ` · from ₹${service.priceFrom}` : ""}
                </p>
              </div>
              <ServiceRowActions id={service.id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
