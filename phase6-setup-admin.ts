import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const email = "phase6.admin.test@automatewithjohn.com";
const password = "Phase6TestAdmin!23";

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let authId: string;
  if (error) {
    const { data: list } = await supabase.auth.admin.listUsers();
    const existing = list.users.find((u) => u.email === email);
    if (!existing) throw error;
    authId = existing.id;
  } else {
    authId = data.user!.id;
  }

  await prisma.user.update({
    where: { authId },
    data: { role: "ADMIN", name: "Phase6 Test Admin" },
  });

  console.log("Ready test admin:", email, password);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
