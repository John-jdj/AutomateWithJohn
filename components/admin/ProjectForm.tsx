"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectInput } from "@/lib/validations/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioActionResult } from "@/app/admin/portfolio/actions";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProjectForm({
  defaultValues,
  clients,
  onSubmit,
  submitLabel,
}: {
  defaultValues?: Partial<ProjectInput>;
  clients: { id: string; label: string }[];
  onSubmit: (input: ProjectInput) => Promise<PortfolioActionResult>;
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
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      description: "",
      images: "",
      videoUrl: "",
      techStack: "",
      category: "",
      githubUrl: "",
      liveUrl: "",
      clientId: "",
      featured: false,
      ...defaultValues,
    },
  });

  const slugTouched = useState(() => Boolean(defaultValues?.slug))[0];

  async function submit(input: ProjectInput) {
    setServerError(null);
    try {
      const result = await onSubmit(input);
      console.log("DEBUG submit result", JSON.stringify(result));
      if (result && !result.ok) {
        setServerError(result.error);
        return;
      }
      router.push("/admin/portfolio");
      router.refresh();
    } catch (e) {
      console.log("DEBUG submit threw", String(e));
      throw e;
    }
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
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" rows={2} {...register("summary")} />
        {errors.summary ? (
          <p className="text-sm text-destructive">{errors.summary.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={10} {...register("description")} />
        {errors.description ? (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...register("category")} />
          {errors.category ? (
            <p className="text-sm text-destructive">{errors.category.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="techStack">Tech stack (optional, comma-separated)</Label>
          <Input id="techStack" {...register("techStack")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Image URLs (optional, comma-separated)</Label>
        <Input id="images" {...register("images")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="videoUrl">Video URL (optional)</Label>
          <Input id="videoUrl" {...register("videoUrl")} />
          {errors.videoUrl ? (
            <p className="text-sm text-destructive">{errors.videoUrl.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientId">Client (optional)</Label>
          <select
            id="clientId"
            {...register("clientId")}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="">No client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL (optional)</Label>
          <Input id="githubUrl" {...register("githubUrl")} />
          {errors.githubUrl ? (
            <p className="text-sm text-destructive">{errors.githubUrl.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="liveUrl">Live URL (optional)</Label>
          <Input id="liveUrl" {...register("liveUrl")} />
          {errors.liveUrl ? (
            <p className="text-sm text-destructive">{errors.liveUrl.message}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input id="featured" type="checkbox" {...register("featured")} className="size-4" />
        <Label htmlFor="featured">Featured</Label>
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
