import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Container, Section } from "@/components/ui/section";
import { H1, H2 } from "@/components/ui/typography";
import { LegalDraftNotice } from "@/components/layout/LegalDraftNotice";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Section className="pt-16">
      <Container className="max-w-2xl space-y-8">
        <div>
          <H1 className="text-3xl sm:text-4xl">Terms of Service</H1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: 2026-07-17</p>
        </div>

        <LegalDraftNotice />

        <div className="space-y-6 text-foreground/90">
          <section>
            <H2 className="text-xl">Services</H2>
            <p className="mt-2 text-muted-foreground">
              AutomateWithJohn provides web development, design, and related software
              services. The specific scope, timeline, and price for any project are
              agreed in writing before work begins.
            </p>
          </section>

          <section>
            <H2 className="text-xl">Payments</H2>
            <p className="mt-2 text-muted-foreground">
              Invoices, payment schedules, and refund terms for a given project are
              set out in that project&apos;s agreement.
            </p>
          </section>

          <section>
            <H2 className="text-xl">Intellectual property</H2>
            <p className="mt-2 text-muted-foreground">
              Unless otherwise agreed in writing, ownership of custom work product
              transfers to the client upon full payment. Pre-existing tools,
              frameworks, and internal libraries remain the property of
              AutomateWithJohn.
            </p>
          </section>

          <section>
            <H2 className="text-xl">Limitation of liability</H2>
            <p className="mt-2 text-muted-foreground">
              Services are provided as-is. AutomateWithJohn is not liable for
              indirect, incidental, or consequential damages arising from use of
              delivered work, to the extent permitted by law.
            </p>
          </section>

          <section>
            <H2 className="text-xl">Changes to these terms</H2>
            <p className="mt-2 text-muted-foreground">
              These terms may be updated from time to time. Continued use of this site
              after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <H2 className="text-xl">Contact</H2>
            <p className="mt-2 text-muted-foreground">
              Questions about these terms can be sent through our{" "}
              <a href="/contact" className="underline">
                contact page
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
