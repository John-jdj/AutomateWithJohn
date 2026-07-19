import { emailLayout } from "./layout";

export function quoteRequestNotificationEmail(params: {
  name: string;
  email: string;
  phone?: string | null;
  topic: string;
  content: string;
}) {
  const html = emailLayout(
    `<p><strong>${params.name}</strong> &lt;${params.email}&gt;${params.phone ? ` · ${params.phone}` : ""}</p>
     <p>Topic: ${params.topic}</p>
     <p>${params.content.replace(/\n/g, "<br />")}</p>`,
  );
  return {
    subject: `New consultation request from ${params.name}`,
    html,
    text: `${params.name} <${params.email}>\n${params.phone ?? ""}\nTopic: ${params.topic}\n\n${params.content}`,
  };
}

export function quoteRequestConfirmationEmail(name: string, topic: string) {
  const html = emailLayout(
    `<p>Hi ${name},</p>
     <p>Thanks for booking a consultation about <strong>${topic}</strong>. We'll reach out shortly to schedule a time.</p>`,
    { preheader: "Your consultation request is in" },
  );
  return {
    subject: "Your consultation request is in",
    html,
    text: `Hi ${name},\n\nThanks for booking a consultation about ${topic}. We'll reach out shortly to schedule a time.`,
  };
}
