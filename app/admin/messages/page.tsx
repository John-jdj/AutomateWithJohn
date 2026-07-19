import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { MessageRowActions } from "@/components/admin/MessageRowActions";

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: { convertedToLead: { select: { id: true } } },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Messages</h1>

      <div className="mt-8 space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="rounded-lg border border-border/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{message.name}</p>
                    <Badge variant={message.status === "NEW" ? "default" : "secondary"}>
                      {message.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {message.email} {message.phone ? `· ${message.phone}` : ""} · via{" "}
                    {message.source}
                  </p>
                </div>
                <MessageRowActions
                  id={message.id}
                  status={message.status}
                  alreadyConverted={Boolean(message.convertedToLead)}
                />
              </div>
              {message.subject ? (
                <p className="mt-3 text-sm font-medium">{message.subject}</p>
              ) : null}
              <p className="mt-1 text-sm">{message.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
