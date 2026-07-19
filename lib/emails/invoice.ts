import { emailLayout, button } from "./layout";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function invoiceEmail(params: {
  clientName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  invoiceId: string;
}) {
  const payUrl = `${siteUrl}/portal/invoices/${params.invoiceId}`;
  const html = emailLayout(
    `<p>Hi ${params.clientName},</p>
     <p>A new invoice is ready: <strong>${params.invoiceNumber}</strong> for ${params.currency} ${params.amount.toFixed(2)}.</p>
     ${button(payUrl, "View and pay invoice")}`,
    { preheader: `Invoice ${params.invoiceNumber} is ready` },
  );
  return {
    subject: `Invoice ${params.invoiceNumber} from AutomateWithJohn`,
    html,
    text: `Hi ${params.clientName},\n\nA new invoice is ready: ${params.invoiceNumber} for ${params.currency} ${params.amount.toFixed(2)}.\n\nView and pay: ${payUrl}`,
  };
}
