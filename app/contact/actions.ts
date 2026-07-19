"use server";

import { prisma } from "@/lib/prisma";
import { resend, fromEmail } from "@/lib/resend";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { isRateLimited } from "@/lib/rate-limit";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { contactNotificationEmail, contactConfirmationEmail } from "@/lib/emails/contact";

export type ContactActionResult = { ok: true } | { ok: false; error: string };

export async function submitContactForm(input: ContactInput): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  if (await isRateLimited("contact", { limit: 5, windowMs: 60 * 60 * 1000 })) {
    return { ok: false, error: "Too many messages sent. Please try again later." };
  }

  const humanVerified = await verifyRecaptcha(parsed.data.recaptchaToken);
  if (!humanVerified) {
    return { ok: false, error: "We couldn't verify you're human. Please try again." };
  }

  const message = await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject || null,
      content: parsed.data.message,
      source: "contact_form",
    },
  });

  if (resend) {
    const notification = contactNotificationEmail(message);
    await resend.emails.send({
      from: fromEmail,
      to: fromEmail,
      replyTo: message.email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });

    const confirmation = contactConfirmationEmail(message.name);
    await resend.emails.send({
      from: fromEmail,
      to: message.email,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    });
  }

  return { ok: true };
}
