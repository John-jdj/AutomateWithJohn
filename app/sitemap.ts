import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const staticRoutes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/portfolio", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/pricing", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/testimonials", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/careers", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/book-consultation", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await prisma.project.findMany({
    where: { publishedAt: { not: null } },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/portfolio/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
