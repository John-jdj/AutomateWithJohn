"use server";

import { prisma } from "@/lib/prisma";
import { resend, fromEmail } from "@/lib/resend";
import { newsletterSchema, type NewsletterInput } from "@/lib/validations/newsletter";
import { newsletterConfirmationEmail } from "@/lib/emails/newsletter";

export type NewsletterActionResult = { ok: true } | { ok: false; error: string };

export async function subscribeNewsletter(input: NewsletterInput): Promise<NewsletterActionResult> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing && !existing.unsubscribedAt) {
    return { ok: true };
  }

  if (existing) {
    await prisma.newsletterSubscriber.update({
      where: { email: parsed.data.email },
      data: { unsubscribedAt: null, subscribedAt: new Date() },
    });
  } else {
    await prisma.newsletterSubscriber.create({ data: { email: parsed.data.email } });
  }

  if (resend) {
    const { subject, html, text } = newsletterConfirmationEmail();
    await resend.emails.send({ from: fromEmail, to: parsed.data.email, subject, html, text });
  }

  return { ok: true };
}
