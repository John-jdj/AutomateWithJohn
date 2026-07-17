import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";

export default function NotFound() {
  return (
    <Section className="flex flex-1 items-center">
      <Container className="text-center">
        <H1 className="text-3xl sm:text-4xl">Page not found</H1>
        <Lead className="mx-auto mt-4 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </Lead>
        <Button className="mt-8" render={<Link href="/" />} nativeButton={false}>
          Back to home
        </Button>
      </Container>
    </Section>
  );
}
