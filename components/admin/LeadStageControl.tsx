"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLeadStage, deleteLead, convertLeadToClient } from "@/app/admin/leads/actions";
import { pipelineStages, type PipelineStageValue } from "@/lib/validations/leads";
import { Button } from "@/components/ui/button";

export function LeadStageControl({
  id,
  stage,
  alreadyConverted,
}: {
  id: string;
  stage: PipelineStageValue;
  alreadyConverted: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={stage}
          disabled={isPending || alreadyConverted}
          onChange={(e) =>
            startTransition(async () => {
              await setLeadStage(id, e.target.value as PipelineStageValue);
              router.refresh();
            })
          }
          className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none disabled:opacity-50 dark:bg-input/30"
        >
          {pipelineStages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {alreadyConverted ? null : (
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={() => {
              if (
                !confirm(
                  "Convert this lead into a client account? This invites them by email if they don't already have an account.",
                )
              )
                return;
              setError(null);
              startTransition(async () => {
                const result = await convertLeadToClient(id);
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                router.refresh();
              });
            }}
          >
            Convert to client
          </Button>
        )}

        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={() => {
            if (!confirm("Delete this lead? This can't be undone.")) return;
            startTransition(async () => {
              await deleteLead(id);
              router.refresh();
              router.push("/admin/leads");
            });
          }}
        >
          Delete
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      {alreadyConverted ? (
        <p className="text-xs text-muted-foreground">Already converted to a client.</p>
      ) : null}
    </div>
  );
}
