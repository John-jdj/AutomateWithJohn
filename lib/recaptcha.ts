// Guarded: RECAPTCHA_SECRET_KEY isn't set yet in this environment. Until
// it is, verification is skipped (returns pass) rather than silently
// failing closed or faking a real check — TODO once keys are provided
// (see .env.example). See CLAUDE.md rule 4.
export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) return true;
  if (!token) return false;

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: secretKey, response: token }),
  });
  const data: { success: boolean; score?: number } = await response.json();
  return data.success && (data.score === undefined || data.score >= 0.5);
}
