import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";
import { H2 } from "@/components/ui/typography";

export async function TestimonialCarousel() {
  const testimonials = await prisma.testimonial.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  if (testimonials.length === 0) return null;

  return (
    <Section className="border-t border-border/60">
      <Container>
        <H2 className="text-center">What clients say</H2>
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
