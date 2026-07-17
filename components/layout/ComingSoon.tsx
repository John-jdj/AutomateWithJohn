import { Container, Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";

// Placeholder for pages whose real content is built in a later BUILD_PLAN
// phase. See CLAUDE.md rule 4 — flagged explicitly rather than presented
// as finished.
export function ComingSoon({ title }: { title: string }) {
  return (
    <Section className="flex flex-1 items-center">
      <Container className="text-center">
        <H1 className="text-3xl sm:text-4xl">{title}</H1>
        <Lead className="mx-auto mt-4 max-w-md">
          This page is under construction. Check back soon.
        </Lead>
      </Container>
    </Section>
  );
}
