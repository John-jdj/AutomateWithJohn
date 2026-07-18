import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProject } from "@/app/admin/portfolio/actions";

export default async function NewProjectPage() {
  await requireAdmin();
  const clients = await prisma.client.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">New project</h1>
      <div className="mt-8">
        <ProjectForm
          onSubmit={createProject}
          submitLabel="Create project"
          clients={clients.map((c) => ({
            id: c.id,
            label: c.company || c.user.name || c.user.email,
          }))}
        />
      </div>
    </div>
  );
}
