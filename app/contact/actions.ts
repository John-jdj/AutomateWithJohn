"use server";

import { prisma } from "@/lib/prisma";
import { resend, fromEmail } from "@/lib/resend";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";

export type ContactActionResult = { ok: true } | { ok: false; error: string };

export async function submitContactForm(input: ContactInput): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(input);
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
      subject: parsed.data.subject || null,
      content: parsed.data.message,
      source: "contact_form",
    },
  });

  if (resend) {
    await resend.emails.send({
      from: fromEmail,
      to: fromEmail,
      replyTo: message.email,
      subject: `New contact form submission from ${message.name}`,
      text: `${message.name} <${message.email}>\n${message.phone ?? ""}\n\n${message.content}`,
    });
  }

  return { ok: true };
}
