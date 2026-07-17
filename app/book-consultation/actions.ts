"use server";

import { prisma } from "@/lib/prisma";
import { resend, fromEmail } from "@/lib/resend";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { consultationSchema, type ConsultationInput } from "@/lib/validations/contact";

export type ConsultationActionResult = { ok: true } | { ok: false; error: string };

export async function submitConsultationRequest(
  input: ConsultationInput,
): Promise<ConsultationActionResult> {
  const parsed = consultationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
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
    await resend.emails.send({
      from: fromEmail,
      to: fromEmail,
      replyTo: message.email,
      subject: `New consultation request from ${message.name}`,
      text: `${message.name} <${message.email}>\n${message.phone ?? ""}\nTopic: ${parsed.data.topic}\n\n${message.content}`,
    });
  }

  return { ok: true };
}
