import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Container, Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description: "Careers at AutomateWithJohn.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <Section className="flex flex-1 items-center pt-16">
      <Container className="max-w-2xl text-center">
        <H1 className="text-3xl sm:text-4xl">Careers</H1>
        <Lead className="mt-4">
          We&apos;re not hiring right now. If that changes, open roles will be posted
          here — in the meantime, feel free to{" "}
          <Link href="/contact" className="underline">
            reach out
          </Link>
          .
        </Lead>
      </Container>
    </Section>
  );
}
