"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceInput } from "@/lib/validations/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ServiceActionResult } from "@/app/admin/services/actions";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ServiceForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: {
  defaultValues?: Partial<ServiceInput>;
  onSubmit: (input: ServiceInput) => Promise<ServiceActionResult>;
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
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      icon: "",
      features: "",
      priceFrom: "",
      category: "",
      order: "0",
      ...defaultValues,
    },
  });

  const slugTouched = useState(() => Boolean(defaultValues?.slug))[0];

  async function submit(input: ServiceInput) {
    setServerError(null);
    const result = await onSubmit(input);
    if (result && !result.ok) {
      setServerError(result.error);
      return;
    }
    router.push("/admin/services");
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
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={5} {...register("description")} />
        {errors.description ? (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category (optional)</Label>
          <Input id="category" {...register("category")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Icon name (optional)</Label>
          <Input id="icon" {...register("icon")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (optional, comma-separated)</Label>
        <Input id="features" {...register("features")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priceFrom">Starting price (optional)</Label>
          <Input id="priceFrom" type="number" min="0" step="0.01" {...register("priceFrom")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Display order</Label>
          <Input id="order" type="number" step="1" {...register("order")} />
        </div>
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
