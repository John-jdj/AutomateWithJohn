"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteComment, moderateComment } from "@/app/admin/blog/actions";

export function CommentModerationActions({
  id,
  status,
}: {
  id: string;
  status: "PENDING" | "APPROVED" | "SPAM";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      {status !== "APPROVED" ? (
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await moderateComment(id, "APPROVED");
              router.refresh();
            })
          }
        >
          Approve
        </Button>
      ) : null}
      {status !== "SPAM" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await moderateComment(id, "SPAM");
              router.refresh();
            })
          }
        >
          Mark spam
        </Button>
      ) : null}
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Delete this comment?")) return;
          startTransition(async () => {
            await deleteComment(id);
            router.refresh();
          });
        }}
      >
        Delete
      </Button>
    </div>
  );
}
