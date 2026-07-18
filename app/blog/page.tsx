import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";
import { H1, H3, Lead } from "@/components/ui/typography";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Writing from AutomateWithJohn.",
  path: "/blog",
});

type Props = { searchParams: Promise<{ tag?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const { tag } = await searchParams;

  const posts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      ...(tag ? { tags: { has: tag } } : {}),
    },
    orderBy: { publishedAt: "desc" },
  });

  const allPublished = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { tags: true },
  });
  const allTags = Array.from(new Set(allPublished.flatMap((p) => p.tags))).sort();

  if (posts.length === 0 && !tag) {
    return <ComingSoon title="Blog" />;
  }

  return (
    <Section className="pt-16">
      <Container>
        <H1 className="text-3xl sm:text-4xl">Blog</H1>
        <Lead className="mt-4 max-w-2xl">Notes on building and running web products.</Lead>

        {allTags.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2">
            <Link href="/blog">
              <Badge variant={!tag ? "default" : "outline"}>All</Badge>
            </Link>
            {allTags.map((t) => (
              <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`}>
                <Badge variant={tag === t ? "default" : "outline"}>{t}</Badge>
              </Link>
            ))}
          </div>
        ) : null}

        {posts.length === 0 ? (
          <p className="mt-12 text-muted-foreground">No posts tagged &ldquo;{tag}&rdquo; yet.</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <H3 className="text-lg">{post.title}</H3>
                    {post.publishedAt ? (
                      <p className="text-xs text-muted-foreground">
                        {post.publishedAt.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    ) : null}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                    {post.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((t) => (
                          <Badge key={t} variant="outline">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
