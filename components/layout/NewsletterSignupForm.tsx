"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema, type NewsletterInput } from "@/lib/validations/newsletter";
import { subscribeNewsletter } from "@/app/newsletter/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewsletterSignupForm() {
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  async function submit(input: NewsletterInput) {
    const result = await subscribeNewsletter(input);
    setState(result.ok ? "success" : "error");
    if (result.ok) reset();
  }

  if (state === "success") {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        You&apos;re subscribed. Thanks!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-2">
      <Label htmlFor="newsletter-email" className="text-sm font-medium">
        Newsletter
      </Label>
      <div className="flex gap-2">
        <Input
          id="newsletter-email"
          type="email"
          placeholder="you@example.com"
          className="h-8"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "newsletter-email-error" : undefined}
          {...register("email")}
        />
        <Button type="submit" size="sm" disabled={isSubmitting}>
          Subscribe
        </Button>
      </div>
      {errors.email ? (
        <p id="newsletter-email-error" role="alert" className="text-xs text-destructive">
          {errors.email.message}
        </p>
      ) : null}
      {state === "error" ? (
        <p role="alert" className="text-xs text-destructive">
          Something went wrong. Try again.
        </p>
      ) : null}
    </form>
  );
}
