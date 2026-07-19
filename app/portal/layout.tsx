import Link from "next/link";
import { requireClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/(auth)/actions";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, client } = await requireClient();

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border/60 p-4">
        <Link href="/portal" className="text-sm font-semibold">
          AutomateWithJohn — Client Portal
        </Link>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {client.company || user.name || user.email}
          </p>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
