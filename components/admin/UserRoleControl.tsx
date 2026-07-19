"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setUserRole } from "@/app/admin/users/actions";

export function UserRoleControl({
  id,
  role,
  isSelf,
}: {
  id: string;
  role: "ADMIN" | "CLIENT";
  isSelf: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        value={role}
        disabled={isPending || isSelf}
        onChange={(e) =>
          startTransition(async () => {
            setError(null);
            const result = await setUserRole(id, e.target.value as "ADMIN" | "CLIENT");
            if (!result.ok) {
              setError(result.error);
              return;
            }
            router.refresh();
          })
        }
        className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none disabled:opacity-50 dark:bg-input/30"
      >
        <option value="ADMIN">ADMIN</option>
        <option value="CLIENT">CLIENT</option>
      </select>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
