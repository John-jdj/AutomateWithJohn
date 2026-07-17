import { Container, Section } from "@/components/ui/section";
import { H2, Lead } from "@/components/ui/typography";

const steps = [
  {
    title: "Discover",
    description:
      "We start with your goals, constraints, and existing systems — not a template.",
  },
  {
    title: "Design",
    description:
      "Wireframes and a working visual language before any production code is written.",
  },
  {
    title: "Build",
    description:
      "Iterative delivery in review-able phases, with real infrastructure from day one.",
  },
  {
    title: "Launch & support",
    description:
      "Deployment, monitoring, and a plan for what happens after the first release.",
  },
];

export function ProcessSteps() {
  return (
    <Section className="border-t border-border/60">
      <Container>
        <div className="max-w-2xl">
          <H2>How we work</H2>
          <Lead className="mt-4">A straightforward process, reviewed with you at every stage.</Lead>
        </div>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="text-sm font-medium text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
