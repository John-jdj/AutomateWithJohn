import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Badge } from "@/components/ui/badge";

const SETTINGS_ID = "singleton";

const integrations = [
  { label: "Resend (email)", envVar: "RESEND_API_KEY" },
  { label: "Razorpay (payments)", envVar: "RAZORPAY_KEY_ID" },
  { label: "reCAPTCHA", envVar: "RECAPTCHA_SECRET_KEY" },
  { label: "Google Analytics 4", envVar: "NEXT_PUBLIC_GA4_MEASUREMENT_ID" },
  { label: "Microsoft Clarity", envVar: "NEXT_PUBLIC_CLARITY_PROJECT_ID" },
  { label: "OpenAI (chatbot, Phase 11)", envVar: "OPENAI_API_KEY" },
];

export default async function AdminSettingsPage() {
  await requireAdmin();

  const settings = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
  const socialLinks = (settings?.socialLinks as Record<string, string> | null) ?? {};

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="mt-8">
        <SettingsForm
          defaultValues={{
            siteName: settings?.siteName ?? "AutomateWithJohn",
            siteDescription: settings?.siteDescription ?? "",
            contactEmail: settings?.contactEmail ?? "",
            contactPhone: settings?.contactPhone ?? "",
            twitter: socialLinks.twitter ?? "",
            linkedin: socialLinks.linkedin ?? "",
            github: socialLinks.github ?? "",
            instagram: socialLinks.instagram ?? "",
          }}
        />
      </div>

      <div className="mt-12 max-w-2xl border-t border-border/60 pt-8">
        <h2 className="text-xl font-semibold">Integration status</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Read-only. Configure real values in <code>.env</code> — never entered here.
        </p>
        <div className="mt-4 space-y-2">
          {integrations.map((integration) => {
            const configured = Boolean(process.env[integration.envVar]);
            return (
              <div
                key={integration.envVar}
                className="flex items-center justify-between rounded-md border border-border/60 p-3 text-sm"
              >
                <span>{integration.label}</span>
                <Badge variant={configured ? "default" : "secondary"}>
                  {configured ? "Configured" : "Not configured"}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
