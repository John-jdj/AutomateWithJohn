import OpenAI from "openai";

// Guarded: OPENAI_API_KEY isn't set yet in this environment. Callers must
// check `openai` for null and fail soft with a clear message — never
// fabricate an assistant reply. See Phase 4 summary / CLAUDE.md rule 4.
export const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export const chatbotModel = "gpt-4o-mini";
