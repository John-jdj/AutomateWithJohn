"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitConsultationRequest } from "@/app/book-consultation/actions";
import { consultationSchema, type ConsultationInput } from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecaptchaScript, getRecaptchaToken } from "@/components/forms/Recaptcha";

const topics = [
  { value: "new_project", label: "New project" },
  { value: "existing_project", label: "Existing project / ongoing work" },
  { value: "audit", label: "Technical audit / second opinion" },
  { value: "other", label: "Something else" },
];

export function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      topic: "",
      message: "",
    },
  });

  async function onSubmit(data: ConsultationInput) {
    setServerError(null);
    const recaptchaToken = await getRecaptchaToken("book_consultation");
    const result = await submitConsultationRequest({ ...data, recaptchaToken });
    if (result.ok) {
      setSubmitted(true);
    } else {
      setServerError(result.error);
    }
  }

  if (submitted) {
    return (
      <p role="status" className="rounded-md bg-muted p-4 text-sm">
        Thanks — we&apos;ve received your request and will follow up to schedule a time.
      </p>
    );
  }

  return (
    <>
      <RecaptchaScript />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
            {errors.name ? (
              <p id="name-error" role="alert" className="text-sm text-destructive">
                {errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email ? (
              <p id="email-error" role="alert" className="text-sm text-destructive">
                {errors.email.message}
              </p>
            ) : null}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" type="tel" {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company (optional)</Label>
            <Input id="company" {...register("company")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Controller
            name="topic"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="topic" className="w-full">
                  <SelectValue placeholder="Select a topic">
                    {(value: string) => topics.find((topic) => topic.value === value)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.topic ? (
            <p role="alert" className="text-sm text-destructive">
              {errors.topic.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">What would you like to discuss?</Label>
          <Textarea
            id="message"
            rows={5}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            {...register("message")}
          />
          {errors.message ? (
            <p id="message-error" role="alert" className="text-sm text-destructive">
              {errors.message.message}
            </p>
          ) : null}
        </div>
        {serverError ? (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Request consultation"}
        </Button>
      </form>
    </>
  );
}
