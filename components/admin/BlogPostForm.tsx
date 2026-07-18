"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BlogActionResult } from "@/app/admin/blog/actions";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BlogPostForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: {
  defaultValues?: Partial<BlogPostInput>;
  onSubmit: (input: BlogPostInput) => Promise<BlogActionResult>;
  submitLabel: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      tags: "",
      category: "",
      seoTitle: "",
      seoDescription: "",
      ...defaultValues,
    },
  });

  const slugTouched = useState(() => Boolean(defaultValues?.slug))[0];

  async function submit(input: BlogPostInput) {
    setServerError(null);
    const result = await onSubmit(input);
    if (result && !result.ok) {
      setServerError(result.error);
      return;
    }
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title", {
            onChange: (e) => {
              if (!slugTouched && !watch("slug")) {
                setValue("slug", slugify(e.target.value));
              }
            },
          })}
        />
        {errors.title ? <p className="text-sm text-destructive">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" {...register("slug")} />
        {errors.slug ? <p className="text-sm text-destructive">{errors.slug.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" rows={2} {...register("excerpt")} />
        {errors.excerpt ? (
          <p className="text-sm text-destructive">{errors.excerpt.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" rows={14} {...register("content")} />
        {errors.content ? (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category (optional)</Label>
          <Input id="category" {...register("category")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (optional, comma-separated)</Label>
          <Input id="tags" {...register("tags")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover image URL (optional)</Label>
        <Input id="coverImage" {...register("coverImage")} />
        {errors.coverImage ? (
          <p className="text-sm text-destructive">{errors.coverImage.message}</p>
        ) : null}
      </div>

      <div className="space-y-2 rounded-md border border-border/60 p-4">
        <p className="text-sm font-medium">SEO (optional)</p>
        <div className="space-y-2">
          <Label htmlFor="seoTitle">SEO title</Label>
          <Input id="seoTitle" {...register("seoTitle")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoDescription">SEO description</Label>
          <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
        </div>
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
