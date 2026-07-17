import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";
import { H2, Lead } from "@/components/ui/typography";

export async function FeaturedProjects() {
  const projects = await prisma.project.findMany({
    where: { featured: true, publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  if (projects.length === 0) return null;

  return (
    <Section className="border-t border-border/60">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <H2>Selected work</H2>
            <Lead className="mt-4">A look at what we&apos;ve shipped recently.</Lead>
          </div>
          <Link href="/portfolio" className="text-sm font-medium underline">
            View all projects
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>
                  <Link href={`/portfolio/${project.slug}`}>{project.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{project.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
