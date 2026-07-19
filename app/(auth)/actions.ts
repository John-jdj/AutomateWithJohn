"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { resend, fromEmail } from "@/lib/resend";
import { welcomeEmail } from "@/lib/emails/welcome";
import { passwordResetEmail } from "@/lib/emails/password-reset";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/validations/auth";

export type ActionResult = { error: string } | void;

export async function login(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: error.message };
  }

  const next = formData.get("next");
  redirect(typeof next === "string" && next ? next : "/");
}

export async function signup(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  if (error) {
    return { error: error.message };
  }

  if (resend) {
    const { subject, html, text } = welcomeEmail(parsed.data.name);
    await resend.emails.send({ from: fromEmail, to: parsed.data.email, subject, html, text });
  }

  redirect("/login?checkEmail=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPassword(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Generate the reset link via the admin API rather than
  // resetPasswordForEmail() so we can send it ourselves through Resend
  // instead of Supabase's built-in email sender. generateLink() errors if
  // the email doesn't exist — deliberately swallowed below so this action
  // doesn't reveal whether an account exists (matches the generic
  // "if an account exists…" copy already on /forgot-password).
  if (resend) {
    const adminClient = getSupabaseAdminClient();
    const { data, error } = await adminClient.auth.admin.generateLink({
      type: "recovery",
      email: parsed.data.email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
      },
    });
    if (!error && data.properties?.action_link) {
      const { subject, html, text } = passwordResetEmail(data.properties.action_link);
      await resend.emails.send({ from: fromEmail, to: parsed.data.email, subject, html, text });
    }
  } else {
    // Guarded fallback: no RESEND_API_KEY configured, so use Supabase's
    // own built-in reset email instead of silently sending nothing.
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
    });
  }

  redirect("/forgot-password?sent=1");
}

export async function resetPassword(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { error: error.message };
  }

  redirect("/login?reset=1");
}
