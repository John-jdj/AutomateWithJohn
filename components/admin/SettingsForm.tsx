"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";
import { updateSettings } from "@/app/admin/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SettingsForm({ defaultValues }: { defaultValues: SettingsInput }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  async function submit(input: SettingsInput) {
    setServerError(null);
    setSaved(false);
    const result = await updateSettings(input);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="siteName">Site name</Label>
        <Input id="siteName" {...register("siteName")} />
        {errors.siteName ? (
          <p className="text-sm text-destructive">{errors.siteName.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="siteDescription">Site description (optional)</Label>
        <Textarea id="siteDescription" rows={2} {...register("siteDescription")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact email (optional)</Label>
          <Input id="contactEmail" {...register("contactEmail")} />
          {errors.contactEmail ? (
            <p className="text-sm text-destructive">{errors.contactEmail.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Contact phone (optional)</Label>
          <Input id="contactPhone" {...register("contactPhone")} />
        </div>
      </div>

      <div className="space-y-2 rounded-md border border-border/60 p-4">
        <p className="text-sm font-medium">Social links (optional)</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter / X</Label>
            <Input id="twitter" {...register("twitter")} />
            {errors.twitter ? (
              <p className="text-sm text-destructive">{errors.twitter.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" {...register("linkedin")} />
            {errors.linkedin ? (
              <p className="text-sm text-destructive">{errors.linkedin.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input id="github" {...register("github")} />
            {errors.github ? (
              <p className="text-sm text-destructive">{errors.github.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" {...register("instagram")} />
            {errors.instagram ? (
              <p className="text-sm text-destructive">{errors.instagram.message}</p>
            ) : null}
          </div>
        </div>
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
      {saved ? <p className="text-sm text-primary">Saved.</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
