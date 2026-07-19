"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteTestimonial } from "@/app/admin/testimonials/actions";

export function TestimonialRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this testimonial? This can't be undone.")) return;
        startTransition(async () => {
          await deleteTestimonial(id);
          router.refresh();
        });
      }}
    >
      Delete
    </Button>
  );
}
