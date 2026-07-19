import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TestimonialRowActions } from "@/components/admin/TestimonialRowActions";

export default async function AdminTestimonialsPage() {
  await requireAdmin();
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Testimonials</h1>
        <Button render={<Link href="/admin/testimonials/new" />} nativeButton={false}>
          New testimonial
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {testimonials.length === 0 ? (
          <p className="text-sm text-muted-foreground">No testimonials yet.</p>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/testimonials/${t.id}`} className="font-medium underline">
                    {t.clientName}
                  </Link>
                  {t.featured ? <Badge variant="outline">Featured</Badge> : null}
                  <Badge variant="secondary">{t.rating}★</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.clientRole ? `${t.clientRole} · ` : ""}
                  {t.company ?? ""}
                </p>
              </div>
              <TestimonialRowActions id={t.id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
