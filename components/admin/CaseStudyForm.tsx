"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { caseStudySchema, type CaseStudyInput } from "@/lib/validations/portfolio";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioActionResult } from "@/app/admin/portfolio/actions";
import { deleteCaseStudy } from "@/app/admin/portfolio/actions";

export function CaseStudyForm({
  projectId,
  defaultValues,
  onSubmit,
}: {
  projectId: string;
  defaultValues?: Partial<CaseStudyInput>;
  onSubmit: (input: CaseStudyInput) => Promise<PortfolioActionResult>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const hasExisting = Boolean(defaultValues?.challenge);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CaseStudyInput>({
    resolver: zodResolver(caseStudySchema),
    defaultValues: {
      challenge: "",
      solution: "",
      results: "",
      metrics: "",
      ...defaultValues,
    },
  });

  async function submit(input: CaseStudyInput) {
    setServerError(null);
    const result = await onSubmit(input);
    if (result && !result.ok) {
      setServerError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="challenge">Challenge</Label>
        <Textarea id="challenge" rows={4} {...register("challenge")} />
        {errors.challenge ? (
          <p className="text-sm text-destructive">{errors.challenge.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="solution">Solution</Label>
        <Textarea id="solution" rows={4} {...register("solution")} />
        {errors.solution ? (
          <p className="text-sm text-destructive">{errors.solution.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="results">Results</Label>
        <Textarea id="results" rows={4} {...register("results")} />
        {errors.results ? (
          <p className="text-sm text-destructive">{errors.results.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="metrics">Metrics (optional, JSON)</Label>
        <Textarea
          id="metrics"
          rows={2}
          placeholder='{"conversionLift": "34%"}'
          {...register("metrics")}
        />
        {errors.metrics ? (
          <p className="text-sm text-destructive">{errors.metrics.message}</p>
        ) : null}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : hasExisting ? "Save case study" : "Add case study"}
        </Button>
        {hasExisting ? (
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            onClick={() => {
              if (!confirm("Delete this case study? This can't be undone.")) return;
              deleteCaseStudy(projectId).then(() => router.refresh());
            }}
          >
            Delete case study
          </Button>
        ) : null}
      </div>
    </form>
  );
}
