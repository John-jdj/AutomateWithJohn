import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";
import { faqs } from "@/lib/data/faq";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description: "Frequently asked questions about working with AutomateWithJohn.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <Section className="pt-16">
      <Container className="max-w-2xl">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }),
          }}
        />
        <H1 className="text-3xl sm:text-4xl">Frequently asked questions</H1>
        <Lead className="mt-4">Everything we get asked before a project starts.</Lead>

        <Accordion className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={String(index)}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}
