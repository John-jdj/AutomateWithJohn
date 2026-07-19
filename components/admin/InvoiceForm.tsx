"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, type InvoiceInput } from "@/lib/validations/invoices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InvoiceActionResult } from "@/app/admin/invoices/actions";

export function InvoiceForm({
  defaultValues,
  clients,
  projects,
  onSubmit,
  submitLabel,
}: {
  defaultValues?: Partial<InvoiceInput>;
  clients: { id: string; label: string }[];
  projects: { id: string; label: string }[];
  onSubmit: (input: InvoiceInput) => Promise<InvoiceActionResult>;
  submitLabel: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: "",
      projectId: "",
      dueDate: "",
      items: [{ description: "", quantity: "1", unitPrice: "0" }],
      ...defaultValues,
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");
  const total = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  );

  async function submit(input: InvoiceInput) {
    setServerError(null);
    const result = await onSubmit(input);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    router.push(result.id ? `/admin/invoices/${result.id}` : "/admin/invoices");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client</Label>
          <select
            id="clientId"
            {...register("clientId")}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none dark:bg-input/30"
          >
            <option value="">Select a client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.clientId ? (
            <p className="text-sm text-destructive">{errors.clientId.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectId">Project (optional)</Label>
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

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due date (optional)</Label>
        <Input id="dueDate" type="date" {...register("dueDate")} />
      </div>

      <div className="space-y-2">
        <Label>Line items</Label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-wrap items-start gap-2">
              <Input
                placeholder="Description"
                className="flex-1"
                {...register(`items.${index}.description`)}
              />
              <Input
                type="number"
                step="1"
                min="1"
                placeholder="Qty"
                className="w-20"
                {...register(`items.${index}.quantity`)}
              />
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Unit price"
                className="w-28"
                {...register(`items.${index}.unitPrice`)}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={fields.length === 1}
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        {errors.items?.message ? (
          <p className="text-sm text-destructive">{errors.items.message}</p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ description: "", quantity: "1", unitPrice: "0" })}
        >
          Add line item
        </Button>
      </div>

      <p className="text-sm font-medium">Total: ₹{total.toFixed(2)}</p>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
