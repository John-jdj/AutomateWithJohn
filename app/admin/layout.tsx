import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/(auth)/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-border/60 md:flex md:flex-col">
        <div className="border-b border-border/60 p-4">
          <Link href="/admin" className="text-sm font-semibold">
            AutomateWithJohn
          </Link>
          <p className="text-xs text-muted-foreground">Admin dashboard</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AdminNav />
        </div>
        <div className="border-t border-border/60 p-4">
          <p className="truncate text-sm font-medium">{admin.name ?? admin.email}</p>
          <p className="truncate text-xs text-muted-foreground">{admin.email}</p>
          <form action={signOut} className="mt-2">
            <Button type="submit" variant="outline" size="sm" className="w-full">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <div className="border-b border-border/60 p-4 md:hidden">
          <p className="text-sm font-semibold">AutomateWithJohn Admin</p>
        </div>
        {children}
      </div>
    </div>
  );
}
