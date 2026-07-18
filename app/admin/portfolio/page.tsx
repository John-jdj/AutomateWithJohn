import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";

export default async function AdminPortfolioPage() {
  await requireAdmin();
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { caseStudy: { select: { id: true } } },
  });

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        <Button render={<Link href="/admin/portfolio/new" />} nativeButton={false}>
          New project
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/portfolio/${project.id}`} className="font-medium underline">
                    {project.title}
                  </Link>
                  <Badge variant={project.publishedAt ? "default" : "secondary"}>
                    {project.publishedAt ? "PUBLISHED" : "DRAFT"}
                  </Badge>
                  {project.featured ? <Badge variant="outline">Featured</Badge> : null}
                  {!project.caseStudy ? (
                    <Badge variant="outline">No case study</Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  /{project.slug} · {project.category}
                </p>
              </div>
              <ProjectRowActions id={project.id} published={Boolean(project.publishedAt)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
