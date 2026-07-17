import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";
import { H1, H2, Lead } from "@/components/ui/typography";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description: "What AutomateWithJohn builds: web apps, dashboards, and the automation behind them.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  if (services.length === 0) {
    return <ComingSoon title="Services" />;
  }

  return (
    <Section className="pt-16">
      <Container>
        <H1 className="text-3xl sm:text-4xl">Services</H1>
        <Lead className="mt-4 max-w-2xl">
          Every engagement is scoped to what you actually need — here&apos;s the work
          we do most.
        </Lead>

        <div className="mt-12 space-y-8">
          {services.map((service) => (
            <Card key={service.id} id={service.slug}>
              <CardHeader>
                <H2 className="text-xl sm:text-2xl">{service.title}</H2>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{service.description}</p>
                {service.features.length > 0 ? (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-sm text-foreground/90">
                        · {feature}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl bg-accent px-6 py-12 text-center">
          <H2 className="text-2xl">Not sure what you need?</H2>
          <p className="max-w-md text-muted-foreground">
            Book a free consultation and we&apos;ll help you figure out the right scope.
          </p>
          <Button render={<Link href="/book-consultation" />} nativeButton={false}>
            Book a consultation
          </Button>
        </div>
      </Container>
    </Section>
  );
}
