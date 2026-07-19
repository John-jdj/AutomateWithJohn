import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { InvoicePDF } from "@/components/pdf/InvoicePDF";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
    include: { client: true },
  });
  if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      client: { include: { user: { select: { name: true, email: true } } } },
      payments: { where: { status: "SUCCESS" } },
    },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = dbUser.client?.id === invoice.clientId;
  const isAdmin = dbUser.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const paid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);

  const buffer = await renderToBuffer(
    <InvoicePDF
      invoice={{
        number: invoice.number,
        amount: Number(invoice.amount),
        currency: invoice.currency,
        status: invoice.status,
        dueDate: invoice.dueDate,
        createdAt: invoice.createdAt,
        items: invoice.items as unknown as { description: string; quantity: number; unitPrice: number }[],
        clientName: invoice.client.company || invoice.client.user.name || invoice.client.user.email,
        clientEmail: invoice.client.user.email,
        paid,
      }}
    />,
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.number}.pdf"`,
    },
  });
}
