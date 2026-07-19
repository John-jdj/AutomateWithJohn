import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// Server Functions aren't covered by proxy.ts matchers if a route ever
// moves — Next.js's own docs warn against relying on proxy alone for
// authorization. Every admin server action must call this explicitly.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
  if (!dbUser || dbUser.role !== "ADMIN") redirect("/unauthorized");

  return dbUser;
}

// Every portal (client-facing) server action/page must call this
// explicitly, for the same reason requireAdmin() does — proxy.ts alone
// isn't a reliable authorization boundary if a route ever moves.
export async function requireClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
    include: { client: true },
  });
  if (!dbUser || !dbUser.client) redirect("/unauthorized");

  return { user: dbUser, client: dbUser.client };
}
