import { Resend } from "resend";

// Guarded: RESEND_API_KEY isn't set yet in this environment. Callers must
// check `resend` for null and fail soft (the DB write is the source of
// truth; email is a best-effort notification), never fabricate a "sent"
// result. See Phase 4 summary / CLAUDE.md rule 4.
export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const fromEmail = process.env.RESEND_FROM_EMAIL ?? "hello@automatewithjohn.com";
