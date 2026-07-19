import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRoleControl } from "@/components/admin/UserRoleControl";

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Users &amp; Roles</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Two roles exist: ADMIN (full dashboard access) and CLIENT (client-facing account only).
      </p>

      <div className="mt-8 space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 p-4"
          >
            <div>
              <p className="font-medium">
                {user.name ?? user.email} {user.id === admin.id ? "(you)" : ""}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>
            <UserRoleControl id={user.id} role={user.role} isSelf={user.id === admin.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
