import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Container, Section } from "@/components/ui/section";
import { H1, H2 } from "@/components/ui/typography";
import { LegalDraftNotice } from "@/components/layout/LegalDraftNotice";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Section className="pt-16">
      <Container className="max-w-2xl space-y-8">
        <div>
          <H1 className="text-3xl sm:text-4xl">Privacy Policy</H1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: 2026-07-17</p>
        </div>

        <LegalDraftNotice />

        <div className="space-y-6 text-foreground/90">
          <section>
            <H2 className="text-xl">Information we collect</H2>
            <p className="mt-2 text-muted-foreground">
              When you fill out a contact or consultation form, we collect your name,
              email address, and anything else you choose to share (phone number,
              company, and your message). If you create an account, we also store your
              email and authentication information via our authentication provider,
              Supabase.
            </p>
          </section>

          <section>
            <H2 className="text-xl">How we use it</H2>
            <p className="mt-2 text-muted-foreground">
              We use this information to respond to inquiries, manage client
              relationships, deliver projects, and, where applicable, process
              payments. We do not sell your personal information.
            </p>
          </section>

          <section>
            <H2 className="text-xl">Third parties</H2>
            <p className="mt-2 text-muted-foreground">
              We use the following third-party services, each of which processes data
              on our behalf under its own privacy policy: Supabase (authentication,
              database, and file storage), Resend (transactional email), Google
              Analytics and Microsoft Clarity (site analytics), and Vercel
              (hosting).
            </p>
          </section>

          <section>
            <H2 className="text-xl">Cookies</H2>
            <p className="mt-2 text-muted-foreground">
              We use cookies required for authentication (keeping you signed in) and,
              where analytics are enabled, to understand site usage.
            </p>
          </section>

          <section>
            <H2 className="text-xl">Your rights</H2>
            <p className="mt-2 text-muted-foreground">
              You can request access to, correction of, or deletion of your personal
              information by contacting us.
            </p>
          </section>

          <section>
            <H2 className="text-xl">Contact</H2>
            <p className="mt-2 text-muted-foreground">
              Questions about this policy can be sent through our{" "}
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
