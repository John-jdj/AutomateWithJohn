"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteMessage, setMessageStatus } from "@/app/admin/messages/actions";

const statuses = ["NEW", "READ", "REPLIED", "ARCHIVED"] as const;

export function MessageRowActions({
  id,
  status,
}: {
  id: string;
  status: (typeof statuses)[number];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={status}
        disabled={isPending}
        onChange={(e) =>
          startTransition(async () => {
            await setMessageStatus(id, e.target.value as (typeof statuses)[number]);
            router.refresh();
          })
        }
        className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none dark:bg-input/30"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Delete this message? This can't be undone.")) return;
          startTransition(async () => {
            await deleteMessage(id);
            router.refresh();
          });
        }}
      >
        Delete
      </Button>
    </div>
  );
}
