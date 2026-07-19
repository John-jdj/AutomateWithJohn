import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  LeadsByStageChart,
  MessagesByStatusChart,
  LeadsOverTimeChart,
} from "@/components/admin/AnalyticsCharts";

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border/60 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [
    totalLeads,
    newMessages,
    publishedProjects,
    publishedPosts,
    pendingComments,
    totalClients,
    leadsByStage,
    messagesByStatus,
    recentLeads,
    successfulPayments,
    pendingInvoices,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.project.count({ where: { publishedAt: { not: null } } }),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.client.count(),
    prisma.lead.groupBy({ by: ["stage"], _count: { _all: true } }),
    prisma.contactMessage.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.payment.findMany({ where: { status: "SUCCESS" }, select: { amount: true } }),
    prisma.invoice.count({ where: { status: "SENT" } }),
  ]);

  const totalRevenue = successfulPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  const stageOrder = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"];
  const leadsByStageData = stageOrder
    .map((stage) => ({
      stage,
      count: leadsByStage.find((g) => g.stage === stage)?._count._all ?? 0,
    }))
    .filter((d) => d.count > 0);

  const messagesByStatusData = messagesByStatus.map((g) => ({
    status: g.status,
    count: g._count._all,
  }));

  const monthBuckets: { key: string; month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    monthBuckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: monthLabel(d),
      count: 0,
    });
  }
  for (const lead of recentLeads) {
    const key = `${lead.createdAt.getFullYear()}-${lead.createdAt.getMonth()}`;
    const bucket = monthBuckets.find((b) => b.key === key);
    if (bucket) bucket.count += 1;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total leads" value={totalLeads} />
        <StatTile label="New messages" value={newMessages} />
        <StatTile label="Published projects" value={publishedProjects} />
        <StatTile label="Published posts" value={publishedPosts} />
        <StatTile label="Pending comments" value={pendingComments} />
        <StatTile label="Clients" value={totalClients} />
        <StatTile label="Revenue collected" value={`₹${totalRevenue.toFixed(2)}`} />
        <StatTile label="Unpaid invoices" value={pendingInvoices} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border/60 p-4">
          <h2 className="text-sm font-medium">Leads by pipeline stage</h2>
          {leadsByStageData.length > 0 ? (
            <LeadsByStageChart data={leadsByStageData} />
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No leads yet.</p>
          )}
        </div>

        <div className="rounded-lg border border-border/60 p-4">
          <h2 className="text-sm font-medium">Messages by status</h2>
          {messagesByStatusData.length > 0 ? (
            <MessagesByStatusChart data={messagesByStatusData} />
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No messages yet.</p>
          )}
        </div>

        <div className="rounded-lg border border-border/60 p-4 lg:col-span-2">
          <h2 className="text-sm font-medium">New leads, last 6 months</h2>
          <LeadsOverTimeChart data={monthBuckets} />
        </div>
      </div>
    </div>
  );
}
