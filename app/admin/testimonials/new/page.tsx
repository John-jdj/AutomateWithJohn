import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { createTestimonial } from "@/app/admin/testimonials/actions";

export default async function NewTestimonialPage() {
  await requireAdmin();
  const [clients, projects] = await Promise.all([
    prisma.client.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.project.findMany({ select: { id: true, title: true }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">New testimonial</h1>
      <div className="mt-8">
        <TestimonialForm
          onSubmit={createTestimonial}
          submitLabel="Create testimonial"
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
