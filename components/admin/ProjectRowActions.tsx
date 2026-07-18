"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteProject, setProjectPublished } from "@/app/admin/portfolio/actions";

export function ProjectRowActions({
  id,
  published,
}: {
  id: string;
  published: boolean;
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
            await setProjectPublished(id, !published);
            router.refresh();
          })
        }
      >
        {published ? "Unpublish" : "Publish"}
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Delete this project? This can't be undone.")) return;
          startTransition(async () => {
            await deleteProject(id);
            router.refresh();
          });
        }}
      >
        Delete
      </Button>
    </div>
  );
}
