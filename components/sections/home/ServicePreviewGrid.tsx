import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";
import { H2, Lead } from "@/components/ui/typography";

export async function ServicePreviewGrid() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    take: 6,
  });

  if (services.length === 0) return null;

  return (
    <Section className="border-t border-border/60">
      <Container>
        <div className="max-w-2xl">
          <H2>What we do</H2>
          <Lead className="mt-4">
            End-to-end web development, from a first prototype to a system
            your whole team relies on.
          </Lead>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>
                  <Link href={`/services#${service.slug}`}>{service.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
