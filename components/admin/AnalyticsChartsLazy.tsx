"use client";

import dynamic from "next/dynamic";

// Recharts is a heavy client-only dependency used solely by this admin
// analytics page. next/dynamic + ssr:false skips server-rendering its SVG
// output and defers the chunk until the client needs it, rather than
// paying that cost on every /admin request. (App Router requires this
// dynamic() call to live in a Client Component, hence this wrapper file —
// app/admin/page.tsx itself is a Server Component.)
const ChartSkeleton = () => <div className="h-[260px] animate-pulse rounded-md bg-muted" />;

export const LeadsByStageChart = dynamic(
  () => import("./AnalyticsCharts").then((m) => m.LeadsByStageChart),
  { ssr: false, loading: ChartSkeleton },
);

export const MessagesByStatusChart = dynamic(
  () => import("./AnalyticsCharts").then((m) => m.MessagesByStatusChart),
  { ssr: false, loading: ChartSkeleton },
);

export const LeadsOverTimeChart = dynamic(
  () => import("./AnalyticsCharts").then((m) => m.LeadsOverTimeChart),
  { ssr: false, loading: ChartSkeleton },
);
