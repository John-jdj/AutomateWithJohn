import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Container, Section } from "@/components/ui/section";
import { H1, H2 } from "@/components/ui/typography";
import { CommentForm } from "@/components/forms/CommentForm";

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true } },
      comments: { where: { status: "APPROVED" }, orderBy: { createdAt: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return buildMetadata({ title: "Post not found" });

  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <Section className="pt-16">
      <Container className="max-w-2xl">
        <Link href="/blog" className="text-sm text-muted-foreground underline">
          ← All posts
        </Link>

        <H1 className="mt-4 text-3xl sm:text-4xl">{post.title}</H1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {post.author.name ? <span>{post.author.name}</span> : null}
          {post.publishedAt ? (
            <span>
              ·{" "}
              {post.publishedAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          ) : null}
        </div>

        {post.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                <Badge variant="outline">{tag}</Badge>
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-10 whitespace-pre-line text-foreground/90">{post.content}</div>

        <div className="mt-16 border-t border-border/60 pt-10">
          <H2 className="text-xl">
            {post.comments.length} comment{post.comments.length === 1 ? "" : "s"}
          </H2>

          {post.comments.length > 0 ? (
            <div className="mt-6 space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="border-b border-border/60 pb-6">
                  <p className="text-sm font-medium">{comment.authorName}</p>
                  <p className="mt-1 text-sm text-foreground/90">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-8">
            <CommentForm postId={post.id} postSlug={post.slug} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
