import { emailLayout } from "./layout";

export function contactNotificationEmail(params: {
  name: string;
  email: string;
  phone?: string | null;
  content: string;
}) {
  const html = emailLayout(
    `<p><strong>${params.name}</strong> &lt;${params.email}&gt;${params.phone ? ` · ${params.phone}` : ""}</p>
     <p>${params.content.replace(/\n/g, "<br />")}</p>`,
  );
  return {
    subject: `New contact form submission from ${params.name}`,
    html,
    text: `${params.name} <${params.email}>\n${params.phone ?? ""}\n\n${params.content}`,
  };
}

export function contactConfirmationEmail(name: string) {
  const html = emailLayout(
    `<p>Hi ${name},</p>
     <p>Thanks for reaching out — we've received your message and will get back to you within one business day.</p>`,
    { preheader: "We received your message" },
  );
  return {
    subject: "We received your message",
    html,
    text: `Hi ${name},\n\nThanks for reaching out — we've received your message and will get back to you within one business day.`,
  };
}
