import Link from "next/link";

// Placeholder — the real admin dashboard shell (nav, all sections) is
// built in BUILD_PLAN.md Phase 7. Individual feature areas (blog, later
// portfolio/CRM/etc.) are linked here in the meantime.
export default function AdminPlaceholderPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-muted-foreground">Dashboard shell arrives in Phase 7.</p>
      <ul className="mt-6 space-y-2">
        <li>
          <Link href="/admin/blog" className="underline">
            Blog
          </Link>
        </li>
        <li>
          <Link href="/admin/portfolio" className="underline">
            Portfolio
          </Link>
        </li>
      </ul>
    </div>
  );
}
