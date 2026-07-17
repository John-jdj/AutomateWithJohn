import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Container, Section } from "@/components/ui/section";
import { H1, H2, Lead } from "@/components/ui/typography";

type Props = { params: Promise<{ slug: string }> };

async function getProject(slug: string) {
  return prisma.project.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: { caseStudy: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return buildMetadata({ title: "Project not found" });

  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/portfolio/${project.slug}`,
  });
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <Section className="pt-16">
      <Container className="max-w-3xl">
        <Link href="/portfolio" className="text-sm text-muted-foreground underline">
          ← All projects
        </Link>
        <H1 className="mt-4 text-3xl sm:text-4xl">{project.title}</H1>
        <Lead className="mt-4">{project.summary}</Lead>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="underline">
              Live site
            </a>
          ) : null}
          {project.githubUrl ? (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="underline">
              Source
            </a>
          ) : null}
        </div>

        <div className="mt-10 max-w-none whitespace-pre-line text-foreground/90">
          {project.description}
        </div>

        {project.caseStudy ? (
          <div className="mt-12 space-y-8 border-t border-border/60 pt-10">
            <div>
              <H2 className="text-xl">The challenge</H2>
              <p className="mt-2 text-muted-foreground">{project.caseStudy.challenge}</p>
            </div>
            <div>
              <H2 className="text-xl">The solution</H2>
              <p className="mt-2 text-muted-foreground">{project.caseStudy.solution}</p>
            </div>
            <div>
              <H2 className="text-xl">The results</H2>
              <p className="mt-2 text-muted-foreground">{project.caseStudy.results}</p>
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
