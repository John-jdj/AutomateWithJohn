import { emailLayout } from "./layout";

export function welcomeEmail(name: string) {
  const html = emailLayout(
    `<p>Hi ${name || "there"},</p>
     <p>Welcome to AutomateWithJohn. Check your inbox for a separate email to confirm your address — once that's done, you're all set.</p>
     <p>If you have any questions in the meantime, just reply to this email.</p>`,
    { preheader: "Welcome to AutomateWithJohn" },
  );
  return {
    subject: "Welcome to AutomateWithJohn",
    html,
    text: `Hi ${name || "there"},\n\nWelcome to AutomateWithJohn. Check your inbox for a separate email to confirm your address.\n\nIf you have any questions, just reply to this email.`,
  };
}
