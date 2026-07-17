import { cn } from "@/lib/utils";

type TextProps = React.HTMLAttributes<HTMLElement>;

function H1({ className, ...props }: TextProps) {
  return (
    <h1
      className={cn(
        "text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl",
        className,
      )}
      {...props}
    />
  );
}

function H2({ className, ...props }: TextProps) {
  return (
    <h2
      className={cn(
        "text-3xl font-semibold tracking-tight text-balance sm:text-4xl",
        className,
      )}
      {...props}
    />
  );
}

function H3({ className, ...props }: TextProps) {
  return (
    <h3 className={cn("text-2xl font-semibold tracking-tight", className)} {...props} />
  );
}

function H4({ className, ...props }: TextProps) {
  return <h4 className={cn("text-xl font-semibold tracking-tight", className)} {...props} />;
}

function Lead({ className, ...props }: TextProps) {
  return (
    <p className={cn("text-lg text-muted-foreground text-pretty sm:text-xl", className)} {...props} />
  );
}

function Muted({ className, ...props }: TextProps) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export { H1, H2, H3, H4, Lead, Muted };
