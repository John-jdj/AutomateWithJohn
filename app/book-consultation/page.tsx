import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";
import { ConsultationForm } from "@/components/forms/ConsultationForm";

export const metadata: Metadata = buildMetadata({
  title: "Book a Consultation",
  description: "Book a free consultation call with AutomateWithJohn.",
  path: "/book-consultation",
});

export default function BookConsultationPage() {
  return (
    <Section className="pt-16">
      <Container className="max-w-2xl">
        <H1 className="text-3xl sm:text-4xl">Book a consultation</H1>
        <Lead className="mt-4">
          A free 30-minute call to talk through what you&apos;re building and whether
          we&apos;re a good fit.
        </Lead>
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Request a call</CardTitle>
          </CardHeader>
          <CardContent>
            <ConsultationForm />
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
