import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const siteName = "AutomateWithJohn";
export const defaultDescription =
  "Web development agency — sites, dashboards, and automation, built and run by John.";

export function buildMetadata({
  title,
  description = defaultDescription,
  path = "",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
