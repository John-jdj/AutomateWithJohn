import { cn } from "@/lib/utils";

function Section({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn("py-16 sm:py-24", className)} {...props} />;
}

function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export { Section, Container };
