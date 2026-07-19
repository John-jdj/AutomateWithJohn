"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setInvoiceStatus, deleteInvoice } from "@/app/admin/invoices/actions";
import { Button } from "@/components/ui/button";

const statuses = ["DRAFT", "SENT", "CANCELLED"] as const;

export function InvoiceStatusControl({
  id,
  status,
  canDelete,
}: {
  id: string;
  status: string;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isManuallySettable = (statuses as readonly string[]).includes(status);

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {isManuallySettable ? (
          <select
            value={status}
            disabled={isPending}
            onChange={(e) =>
              startTransition(async () => {
                await setInvoiceStatus(id, e.target.value as (typeof statuses)[number]);
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
        ) : null}
        {canDelete ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={() => {
              if (!confirm("Delete this invoice? This can't be undone.")) return;
              setError(null);
              startTransition(async () => {
                const result = await deleteInvoice(id);
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                router.push("/admin/invoices");
                router.refresh();
              });
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
