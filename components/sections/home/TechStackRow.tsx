import { Badge } from "@/components/ui/badge";
import { Container, Section } from "@/components/ui/section";
import { Muted } from "@/components/ui/typography";
import { techStack } from "@/lib/data/techStack";

export function TechStackRow() {
  return (
    <Section className="border-t border-border/60 py-10 sm:py-14">
      <Container>
        <Muted className="text-center">Built with a modern, production-grade stack</Muted>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </Container>
    </Section>
  );
}
