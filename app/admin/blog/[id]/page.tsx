import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { updatePost } from "@/app/admin/blog/actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const boundUpdate = updatePost.bind(null, post.id);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Edit post</h1>
      <div className="mt-8">
        <BlogPostForm
          defaultValues={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage ?? "",
            tags: post.tags.join(", "),
            category: post.category ?? "",
            seoTitle: post.seoTitle ?? "",
            seoDescription: post.seoDescription ?? "",
          }}
          onSubmit={boundUpdate}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
