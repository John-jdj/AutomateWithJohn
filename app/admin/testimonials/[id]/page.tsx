import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { updateTestimonial } from "@/app/admin/testimonials/actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditTestimonialPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const [testimonial, clients, projects] = await Promise.all([
    prisma.testimonial.findUnique({ where: { id } }),
    prisma.client.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.project.findMany({ select: { id: true, title: true }, orderBy: { createdAt: "desc" } }),
  ]);
  if (!testimonial) notFound();

  const boundUpdate = updateTestimonial.bind(null, testimonial.id);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Edit testimonial</h1>
      <div className="mt-8">
        <TestimonialForm
          defaultValues={{
            clientName: testimonial.clientName,
            clientRole: testimonial.clientRole ?? "",
            company: testimonial.company ?? "",
            avatar: testimonial.avatar ?? "",
            content: testimonial.content,
            rating: testimonial.rating.toString(),
            featured: testimonial.featured,
            clientId: testimonial.clientId ?? "",
            projectId: testimonial.projectId ?? "",
          }}
          onSubmit={boundUpdate}
          submitLabel="Save changes"
          clients={clients.map((c) => ({
            id: c.id,
            label: c.company || c.user.name || c.user.email,
          }))}
          projects={projects.map((p) => ({ id: p.id, label: p.title }))}
        />
      </div>
    </div>
  );
}
