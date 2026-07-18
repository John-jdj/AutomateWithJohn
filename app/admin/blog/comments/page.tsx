import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { CommentModerationActions } from "@/components/admin/CommentModerationActions";

export default async function CommentModerationPage() {
  await requireAdmin();
  const comments = await prisma.comment.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { post: { select: { title: true, slug: true } } },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Comments</h1>
        <Link href="/admin/blog" className="text-sm underline">
          ← Back to posts
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border border-border/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.authorName}</span>
                  <span className="text-sm text-muted-foreground">{comment.authorEmail}</span>
                  <Badge
                    variant={
                      comment.status === "APPROVED"
                        ? "default"
                        : comment.status === "SPAM"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {comment.status}
                  </Badge>
                </div>
                <Link
                  href={`/blog/${comment.post.slug}`}
                  className="text-sm text-muted-foreground underline"
                >
                  on &ldquo;{comment.post.title}&rdquo;
                </Link>
              </div>
              <p className="mt-2 text-sm text-foreground/90">{comment.content}</p>
              <div className="mt-3">
                <CommentModerationActions id={comment.id} status={comment.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
