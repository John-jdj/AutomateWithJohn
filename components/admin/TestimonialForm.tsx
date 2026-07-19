"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations/testimonials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TestimonialActionResult } from "@/app/admin/testimonials/actions";

export function TestimonialForm({
  defaultValues,
  clients,
  projects,
  onSubmit,
  submitLabel,
}: {
  defaultValues?: Partial<TestimonialInput>;
  clients: { id: string; label: string }[];
  projects: { id: string; label: string }[];
  onSubmit: (input: TestimonialInput) => Promise<TestimonialActionResult>;
  submitLabel: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      clientName: "",
      clientRole: "",
      company: "",
      avatar: "",
      content: "",
      rating: "5",
      featured: false,
      clientId: "",
      projectId: "",
      ...defaultValues,
    },
  });

  async function submit(input: TestimonialInput) {
    setServerError(null);
    const result = await onSubmit(input);
    if (result && !result.ok) {
      setServerError(result.error);
      return;
    }
    router.push("/admin/testimonials");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client name</Label>
          <Input id="clientName" {...register("clientName")} />
          {errors.clientName ? (
            <p className="text-sm text-destructive">{errors.clientName.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientRole">Role (optional)</Label>
          <Input id="clientRole" {...register("clientRole")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Company (optional)</Label>
          <Input id="company" {...register("company")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatar">Avatar URL (optional)</Label>
          <Input id="avatar" {...register("avatar")} />
          {errors.avatar ? (
            <p className="text-sm text-destructive">{errors.avatar.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Testimonial</Label>
        <Textarea id="content" rows={4} {...register("content")} />
        {errors.content ? (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input id="rating" type="number" min="1" max="5" step="1" {...register("rating")} />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input id="featured" type="checkbox" {...register("featured")} className="size-4" />
          <Label htmlFor="featured">Featured</Label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientId">Linked client (optional)</Label>
          <select
            id="clientId"
            {...register("clientId")}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none dark:bg-input/30"
          >
            <option value="">None</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectId">Linked project (optional)</Label>
          <select
            id="projectId"
            {...register("projectId")}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none dark:bg-input/30"
          >
            <option value="">None</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
