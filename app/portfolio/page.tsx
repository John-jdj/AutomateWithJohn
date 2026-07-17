import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";
import { H1, H3, Lead } from "@/components/ui/typography";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = buildMetadata({
  title: "Portfolio",
  description: "Recent work from AutomateWithJohn.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const projects = await prisma.project.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });

  if (projects.length === 0) {
    return <ComingSoon title="Portfolio" />;
  }

  return (
    <Section className="pt-16">
      <Container>
        <H1 className="text-3xl sm:text-4xl">Portfolio</H1>
        <Lead className="mt-4 max-w-2xl">A selection of projects we&apos;ve shipped.</Lead>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/portfolio/${project.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <H3 className="text-lg">{project.title}</H3>
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
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
