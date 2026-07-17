import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";

export function Hero() {
  return (
    <Section className="pt-20 sm:pt-28">
      <Container className="flex flex-col items-center text-center">
        <H1>Web apps and dashboards built to run your business.</H1>
        <Lead className="mt-6 max-w-2xl">
          AutomateWithJohn designs and builds production web applications,
          admin dashboards, and the automation behind them — from first
          line of code to what happens after launch.
        </Lead>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link href="/contact" />} nativeButton={false}>
            Start a project
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href="/portfolio" />}
            nativeButton={false}
          >
            View our work
          </Button>
        </div>
      </Container>
    </Section>
  );
}
