import Link from "next/link";
import { Container } from "@/components/ui/section";
import { mainNav } from "@/lib/data/nav";

const secondaryNav = [
  { label: "Pricing", href: "/pricing" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Careers", href: "/careers" },
];

const legalNav = [
  { label: "Contact", href: "/contact" },
  { label: "Book a consultation", href: "/book-consultation" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-base font-semibold tracking-tight">
            AutomateWithJohn
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Web development agency — sites, dashboards, and automation.
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-2">
          {secondaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-2">
          {legalNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
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
