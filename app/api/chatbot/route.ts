import { NextResponse } from "next/server";
import type { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources/chat/completions";
import { openai, chatbotModel } from "@/lib/openai";
import { buildChatbotSystemPrompt } from "@/lib/chatbot/system-prompt";
import { isRateLimited } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

const captureLead: ChatCompletionTool = {
  type: "function",
  function: {
    name: "capture_lead",
    description: "Save this visitor's contact details so the team can follow up about a potential project.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        company: { type: "string" },
        notes: { type: "string", description: "Brief summary of what they're interested in." },
      },
      required: ["name", "email"],
      additionalProperties: false,
    },
  },
};

function parseMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object" || !("messages" in body)) return null;
  const raw = (body as { messages: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) return null;

  const messages: ChatMessage[] = [];
  for (const item of raw) {
    if (
      !item ||
      typeof item !== "object" ||
      (item as { role?: unknown }).role !== "user" &&
        (item as { role?: unknown }).role !== "assistant"
    ) {
      return null;
    }
    const content = (item as { content?: unknown }).content;
    if (typeof content !== "string" || content.length === 0 || content.length > MAX_MESSAGE_LENGTH) return null;
    messages.push({ role: (item as { role: "user" | "assistant" }).role, content });
  }
  return messages;
}

export async function POST(request: Request) {
  // Rate limit before anything else — this endpoint must stay cheap to spam
  // even when guarded (no OPENAI_API_KEY), since it still hits Postgres.
  if (await isRateLimited("chatbot", { limit: 20, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json(
      { reply: "You've sent a lot of messages — please wait a bit before continuing.", leadCaptured: false },
      { status: 429 },
    );
  }

  if (!openai) {
    return NextResponse.json({
      reply:
        "Chat isn't set up yet — please use the contact form or book a consultation and we'll get back to you.",
      leadCaptured: false,
    });
  }

  const body = await request.json().catch(() => null);
  const history = parseMessages(body);
  if (!history) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const systemPrompt = await buildChatbotSystemPrompt();
  const messages: ChatCompletionMessageParam[] = [{ role: "system", content: systemPrompt }, ...history];

  const first = await openai.chat.completions.create({
    model: chatbotModel,
    messages,
    tools: [captureLead],
  });

  const choice = first.choices[0].message;
  let leadCaptured = false;

  if (choice.tool_calls?.length) {
    messages.push(choice);

    for (const toolCall of choice.tool_calls) {
      if (toolCall.type !== "function" || toolCall.function.name !== "capture_lead") continue;

      let args: { name?: string; email?: string; phone?: string; company?: string; notes?: string } = {};
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch {
        // fall through with empty args; handled below
      }

      let result = "Missing name or email — ask the visitor for both before trying again.";
      if (args.name && args.email) {
        await prisma.lead.create({
          data: {
            name: args.name,
            email: args.email,
            phone: args.phone || null,
            company: args.company || null,
            notes: args.notes || null,
            source: "chatbot",
          },
        });
        leadCaptured = true;
        result = "Lead saved.";
      }

      messages.push({ role: "tool", tool_call_id: toolCall.id, content: result });
    }

    const second = await openai.chat.completions.create({ model: chatbotModel, messages });
    return NextResponse.json({
      reply: second.choices[0].message.content ?? "Thanks — someone from the team will follow up shortly.",
      leadCaptured,
    });
  }

  return NextResponse.json({
    reply: choice.content ?? "Sorry, I didn't catch that — could you rephrase?",
    leadCaptured,
  });
}
