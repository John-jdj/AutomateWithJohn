"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { deleteMedia } from "@/app/admin/media/actions";

export function MediaGridItem({ path, url }: { path: string; url: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-border/60">
      <div className="relative aspect-square bg-muted">
        <Image src={url} alt={path} fill className="object-cover" unoptimized />
      </div>
      <div className="flex items-center justify-between gap-2 p-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "Copied!" : "Copy URL"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={() => {
            if (!confirm("Delete this file? This can't be undone.")) return;
            startTransition(async () => {
              await deleteMedia(path);
              router.refresh();
            });
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
