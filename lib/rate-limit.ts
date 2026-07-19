import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// Fixed-window rate limiter backed by Postgres (see BUILD_PLAN.md Phase 12).
// No new external service — reuses the existing Supabase connection, which
// is fine at this traffic scale. Not exact under heavy concurrent bursts
// (read-then-write isn't atomic), but that's an acceptable trade-off for
// abuse/cost protection on marketing-site forms, not a security boundary.
export async function isRateLimited(
  bucket: string,
  opts: { limit: number; windowMs: number },
): Promise<boolean> {
  const identifier = await getClientIdentifier();
  const key = `${bucket}:${identifier}`;
  const now = new Date();

  const existing = await prisma.rateLimitHit.findUnique({ where: { key } });

  if (!existing || now.getTime() - existing.windowStart.getTime() > opts.windowMs) {
    await prisma.rateLimitHit.upsert({
      where: { key },
      create: { key, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    });
    return false;
  }

  if (existing.count >= opts.limit) {
    return true;
  }

  await prisma.rateLimitHit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });
  return false;
}

async function getClientIdentifier(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
