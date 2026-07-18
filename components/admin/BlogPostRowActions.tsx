"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deletePost, setPostStatus } from "@/app/admin/blog/actions";

export function BlogPostRowActions({
  id,
  status,
}: {
  id: string;
  status: "DRAFT" | "PUBLISHED";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await setPostStatus(id, status === "PUBLISHED" ? "DRAFT" : "PUBLISHED");
            router.refresh();
          })
        }
      >
        {status === "PUBLISHED" ? "Unpublish" : "Publish"}
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Delete this post? This can't be undone.")) return;
          startTransition(async () => {
            await deletePost(id);
            router.refresh();
          });
        }}
      >
        Delete
      </Button>
    </div>
  );
}
