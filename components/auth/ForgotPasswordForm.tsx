"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/SubmitButton";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPassword, undefined);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
        <SubmitButton>Send reset link</SubmitButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
