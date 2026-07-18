"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, type CommentInput } from "@/lib/validations/blog";
import { submitComment } from "@/app/blog/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RecaptchaScript, getRecaptchaToken } from "@/components/forms/Recaptcha";

export function CommentForm({ postId, postSlug }: { postId: string; postSlug: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentInput>({ resolver: zodResolver(commentSchema) });

  async function onSubmit(data: CommentInput) {
    setServerError(null);
    const recaptchaToken = await getRecaptchaToken("blog_comment");
    const result = await submitComment(postId, postSlug, { ...data, recaptchaToken });
    if (result.ok) {
      setSubmitted(true);
      reset();
    } else {
      setServerError(result.error);
    }
  }

  if (submitted) {
    return (
      <p className="rounded-md bg-muted p-4 text-sm">
        Thanks — your comment is awaiting moderation and will appear once approved.
      </p>
    );
  }

  return (
    <>
      <RecaptchaScript />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="authorName">Name</Label>
            <Input id="authorName" {...register("authorName")} />
            {errors.authorName ? (
              <p className="text-sm text-destructive">{errors.authorName.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorEmail">Email</Label>
            <Input id="authorEmail" type="email" {...register("authorEmail")} />
            {errors.authorEmail ? (
              <p className="text-sm text-destructive">{errors.authorEmail.message}</p>
            ) : null}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Comment</Label>
          <Textarea id="content" rows={4} {...register("content")} />
          {errors.content ? (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          ) : null}
        </div>
        {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting…" : "Post comment"}
        </Button>
      </form>
    </>
  );
}
