import { emailLayout, button } from "./layout";

export function passwordResetEmail(resetLink: string) {
  const html = emailLayout(
    `<p>We received a request to reset your AutomateWithJohn password.</p>
     ${button(resetLink, "Reset password")}
     <p style="margin-top:16px;color:#999999;">If you didn't request this, you can safely ignore this email.</p>`,
    { preheader: "Reset your password" },
  );
  return {
    subject: "Reset your AutomateWithJohn password",
    html,
    text: `We received a request to reset your password.\n\nReset it here: ${resetLink}\n\nIf you didn't request this, you can ignore this email.`,
  };
}
