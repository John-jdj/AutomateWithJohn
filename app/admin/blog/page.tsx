import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogPostRowActions } from "@/components/admin/BlogPostRowActions";

export default async function AdminBlogPage() {
  await requireAdmin();
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });
  const pendingComments = await prisma.comment.count({ where: { status: "PENDING" } });

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            render={<Link href="/admin/blog/comments" />}
            nativeButton={false}
          >
            Moderate comments
            {pendingComments > 0 ? (
              <Badge variant="destructive" className="ml-1">
                {pendingComments}
              </Badge>
            ) : null}
          </Button>
          <Button render={<Link href="/admin/blog/new" />} nativeButton={false}>
            New post
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/blog/${post.id}`} className="font-medium underline">
                    {post.title}
                  </Link>
                  <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  /{post.slug} · {post._count.comments} comment
                  {post._count.comments === 1 ? "" : "s"}
                </p>
              </div>
              <BlogPostRowActions id={post.id} status={post.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
