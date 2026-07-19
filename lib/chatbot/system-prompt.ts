import { prisma } from "@/lib/prisma";
import { faqs } from "@/lib/data/faq";

// Knowledge source per BUILD_PLAN.md Phase 11: pull services from the same
// `services` table the public /services page reads, so the chatbot stays in
// sync with whatever admins edit in the dashboard. FAQ content is a small
// static block (lib/data/faq.ts) for things that aren't part of the schema.
export async function buildChatbotSystemPrompt(): Promise<string> {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    select: { title: true, description: true, features: true, priceFrom: true, category: true },
  });

  const servicesBlock = services
    .map((s) => {
      const price = s.priceFrom ? `From $${Number(s.priceFrom).toLocaleString()}` : "Custom pricing";
      const features = s.features.length ? ` Includes: ${s.features.join(", ")}.` : "";
      return `- ${s.title}${s.category ? ` (${s.category})` : ""}: ${s.description} ${price}.${features}`;
    })
    .join("\n");

  const faqBlock = faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

  return `You are the AutomateWithJohn website assistant. AutomateWithJohn is a web development agency (Next.js/TypeScript/PostgreSQL/Supabase, deployed on Vercel) that builds production sites, dashboards, and the automation behind them.

Only answer questions about AutomateWithJohn's services, process, pricing, and general FAQ using the information below. If asked about anything unrelated (general coding help, other companies, unrelated topics), politely decline and steer the conversation back to how AutomateWithJohn can help. Keep answers short and conversational.

If the visitor expresses interest in starting a project, getting a quote, or wants someone to follow up with them, ask for their name and email (and optionally phone/company) and call the capture_lead tool once you have at least a name and email. Don't call it more than once per conversation. After capturing, tell them someone from the team will follow up, and mention they can also use the "Book a consultation" page for a faster response.

## Services
${servicesBlock || "(No services are currently published.)"}

## FAQ
${faqBlock}`;
}
