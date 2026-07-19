"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteService } from "@/app/admin/services/actions";

export function ServiceRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this service? This can't be undone.")) return;
        startTransition(async () => {
          await deleteService(id);
          router.refresh();
        });
      }}
    >
      Delete
    </Button>
  );
}
