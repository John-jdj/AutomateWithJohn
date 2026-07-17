import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";
import { H1, H2, Lead } from "@/components/ui/typography";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description: "How pricing works at AutomateWithJohn.",
  path: "/pricing",
});

const factors = [
  {
    title: "Scope",
    description: "How many pages, flows, and integrations the project needs.",
  },
  {
    title: "Complexity",
    description: "Custom logic, third-party integrations, and data modeling involved.",
  },
  {
    title: "Timeline",
    description: "Standard delivery vs. an accelerated schedule.",
  },
  {
    title: "Ongoing support",
    description: "One-time build vs. continued maintenance and iteration.",
  },
];

export default function PricingPage() {
  return (
    <Section className="pt-16">
      <Container className="max-w-3xl">
        <H1 className="text-3xl sm:text-4xl">Pricing</H1>
        <Lead className="mt-4">
          Every project is different, so we don&apos;t publish flat-rate packages. Instead,
          we scope each engagement with you and provide a fixed quote before any work starts.
        </Lead>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {factors.map((factor) => (
            <Card key={factor.title}>
              <CardContent>
                <H2 className="text-lg">{factor.title}</H2>
                <p className="mt-2 text-sm text-muted-foreground">{factor.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl bg-accent px-6 py-12 text-center">
          <H2 className="text-2xl">Want a quote?</H2>
          <p className="max-w-md text-muted-foreground">
            Tell us about your project and we&apos;ll come back with a scoped, fixed price.
          </p>
          <Button render={<Link href="/contact" />} nativeButton={false}>
            Get a quote
          </Button>
        </div>
      </Container>
    </Section>
  );
}
