import { emailLayout } from "./layout";

export function newsletterConfirmationEmail() {
  const html = emailLayout(
    `<p>You're subscribed to the AutomateWithJohn newsletter.</p>
     <p>We'll send occasional updates on new projects, writing, and product changes — no spam.</p>`,
    { preheader: "You're subscribed" },
  );
  return {
    subject: "You're subscribed to AutomateWithJohn",
    html,
    text: "You're subscribed to the AutomateWithJohn newsletter. We'll send occasional updates — no spam.",
  };
}
