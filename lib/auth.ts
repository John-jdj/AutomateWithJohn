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
