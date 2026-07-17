import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { H2, Lead } from "@/components/ui/typography";

export function FinalCtaBanner() {
  return (
    <Section className="border-t border-border/60">
      <Container className="flex flex-col items-center rounded-2xl bg-accent px-6 py-16 text-center sm:py-20">
        <H2>Have a project in mind?</H2>
        <Lead className="mt-4 max-w-xl">
          Tell us what you&apos;re trying to build. We&apos;ll get back to you with next steps.
        </Lead>
        <Button
          size="lg"
          className="mt-8"
          render={<Link href="/contact" />}
          nativeButton={false}
        >
          Get in touch
        </Button>
      </Container>
    </Section>
  );
}
