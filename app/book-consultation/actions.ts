"use server";

import { prisma } from "@/lib/prisma";
import { resend, fromEmail } from "@/lib/resend";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { isRateLimited } from "@/lib/rate-limit";
import { consultationSchema, type ConsultationInput } from "@/lib/validations/contact";
import { quoteRequestNotificationEmail, quoteRequestConfirmationEmail } from "@/lib/emails/quote";

export type ConsultationActionResult = { ok: true } | { ok: false; error: string };

export async function submitConsultationRequest(
  input: ConsultationInput,
): Promise<ConsultationActionResult> {
  const parsed = consultationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  if (await isRateLimited("consultation", { limit: 5, windowMs: 60 * 60 * 1000 })) {
    return { ok: false, error: "Too many requests sent. Please try again later." };
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
      subject: `Consultation request: ${parsed.data.topic}`,
      content: parsed.data.company
        ? `Company: ${parsed.data.company}\n\n${parsed.data.message}`
        : parsed.data.message,
      source: "consultation_booking",
    },
  });

  if (resend) {
    const notification = quoteRequestNotificationEmail({ ...message, topic: parsed.data.topic });
    await resend.emails.send({
      from: fromEmail,
      to: fromEmail,
      replyTo: message.email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });

    const confirmation = quoteRequestConfirmationEmail(message.name, parsed.data.topic);
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
