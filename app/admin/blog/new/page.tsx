import { requireAdmin } from "@/lib/auth";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { createPost } from "@/app/admin/blog/actions";

export default async function NewBlogPostPage() {
  await requireAdmin();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">New post</h1>
      <div className="mt-8">
        <BlogPostForm onSubmit={createPost} submitLabel="Create post" />
      </div>
    </div>
  );
}
