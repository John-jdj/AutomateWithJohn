import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Container, Section } from "@/components/ui/section";
import { H1, H2, Lead } from "@/components/ui/typography";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "About AutomateWithJohn.",
  path: "/about",
});

// TODO(john): the bio/mission copy below is placeholder draft text — no
// specific biographical claims (years of experience, past clients, etc.)
// were invented since I don't have that information. Replace with your
// real story before launch. See CLAUDE.md rule 4.
export default function AboutPage() {
  return (
    <Section className="pt-16">
      <Container className="max-w-2xl">
        <H1 className="text-3xl sm:text-4xl">About</H1>
        <Lead className="mt-4">
          AutomateWithJohn is a one-person web development studio, run by John.
        </Lead>

        <div className="mt-10 space-y-6 text-foreground/90">
          <p>
            I build production web applications, admin dashboards, and the automation
            that runs behind them — end to end, from the first line of code to what
            happens after launch.
          </p>
          <p>
            Working with one person means fewer handoffs and more direct communication:
            you talk to the person actually writing the code, at every stage of the
            project.
          </p>
        </div>

        <div className="mt-12">
          <H2 className="text-xl">How I work</H2>
          <p className="mt-3 text-muted-foreground">
            Every project starts with understanding your actual goals and constraints,
            not a template. From there: design, build in review-able phases, launch,
            and a plan for what comes after. See the Home page for the fuller
            breakdown.
          </p>
        </div>
      </Container>
    </Section>
  );
}
