import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = buildMetadata({
  title: "Testimonials",
  description: "What clients say about working with AutomateWithJohn.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (testimonials.length === 0) {
    return <ComingSoon title="Testimonials" />;
  }

  return (
    <Section className="pt-16">
      <Container>
        <H1 className="text-3xl sm:text-4xl">Testimonials</H1>
        <Lead className="mt-4 max-w-2xl">What clients say about working with us.</Lead>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent>
                <p className="text-sm text-foreground/90">&ldquo;{testimonial.content}&rdquo;</p>
                <p className="mt-4 text-sm font-medium">{testimonial.clientName}</p>
                <p className="text-xs text-muted-foreground">
                  {[testimonial.clientRole, testimonial.company].filter(Boolean).join(", ")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
