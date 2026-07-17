"use client";

import Script from "next/script";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function RecaptchaScript() {
  if (!siteKey) return null;
  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
      strategy="afterInteractive"
    />
  );
}

// Resolves to undefined when reCAPTCHA isn't configured (see lib/recaptcha.ts
// for the matching server-side no-op), so forms still work without keys.
export async function getRecaptchaToken(action: string): Promise<string | undefined> {
  if (!siteKey || typeof window === "undefined" || !window.grecaptcha) return undefined;

  return new Promise((resolve) => {
    window.grecaptcha!.ready(async () => {
      try {
        const token = await window.grecaptcha!.execute(siteKey, { action });
        resolve(token);
      } catch {
        resolve(undefined);
      }
    });
  });
}
