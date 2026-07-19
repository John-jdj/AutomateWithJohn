import type { NextConfig } from "next";

// BUILD_PLAN.md Phase 12 hardening. Deliberately not using a nonce-based
// strict CSP (Next's recommended approach for script-src 'self' only)
// because that requires every page to render dynamically, which would undo
// this same phase's static-generation footprint. 'unsafe-inline' is needed
// for next-themes' inline dark-mode bootstrap script (FOUC prevention) and
// for Tailwind/base-ui inline style attributes. checkout.razorpay.com is
// allowlisted because PayInvoiceButton loads it as a real external script.
// google.com/gstatic.com are allowlisted for reCAPTCHA v3 (components/forms/Recaptcha.tsx).
// googletagmanager.com/google-analytics.com (GA4) and clarity.ms (Microsoft
// Clarity) are allowlisted for Phase 13's analytics wiring — both no-op
// until their env vars are set, but the CSP needs to be correct for when
// they are (components/analytics/*).
const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.googletagmanager.com https://www.clarity.ms${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.supabase.co;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://checkout.razorpay.com https://www.google.com/recaptcha/ https://*.google-analytics.com https://*.analytics.google.com https://*.clarity.ms;
  frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://www.google.com/recaptcha/;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
