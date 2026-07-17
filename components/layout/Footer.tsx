import Link from "next/link";
import { Container } from "@/components/ui/section";
import { mainNav } from "@/lib/data/nav";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-base font-semibold tracking-tight">
            AutomateWithJohn
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            Web development agency — sites, dashboards, and automation.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>
      </Container>
      <Container className="border-t border-border/60 py-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} AutomateWithJohn. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
