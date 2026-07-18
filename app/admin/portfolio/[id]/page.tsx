import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import { updateProject, upsertCaseStudy } from "@/app/admin/portfolio/actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const [project, clients] = await Promise.all([
    prisma.project.findUnique({ where: { id }, include: { caseStudy: true } }),
    prisma.client.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);
  if (!project) notFound();

  const boundUpdate = updateProject.bind(null, project.id);
  const boundUpsertCaseStudy = upsertCaseStudy.bind(null, project.id);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Edit project</h1>
      <div className="mt-8">
        <ProjectForm
          defaultValues={{
            title: project.title,
            slug: project.slug,
            summary: project.summary,
            description: project.description,
            images: project.images.join(", "),
            videoUrl: project.videoUrl ?? "",
            techStack: project.techStack.join(", "),
            category: project.category,
            githubUrl: project.githubUrl ?? "",
            liveUrl: project.liveUrl ?? "",
            clientId: project.clientId ?? "",
            featured: project.featured,
          }}
          onSubmit={boundUpdate}
          submitLabel="Save changes"
          clients={clients.map((c) => ({
            id: c.id,
            label: c.company || c.user.name || c.user.email,
          }))}
        />
      </div>

      <div className="mt-12 border-t border-border/60 pt-8">
        <h2 className="text-xl font-semibold">Case study</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Optional. Shown on the public project page when present.
        </p>
        <div className="mt-6">
          <CaseStudyForm
            projectId={project.id}
            defaultValues={
              project.caseStudy
                ? {
                    challenge: project.caseStudy.challenge,
                    solution: project.caseStudy.solution,
                    results: project.caseStudy.results,
                    metrics: project.caseStudy.metrics
                      ? JSON.stringify(project.caseStudy.metrics)
                      : "",
                  }
                : undefined
            }
            onSubmit={boundUpsertCaseStudy}
          />
        </div>
      </div>
    </div>
  );
}
