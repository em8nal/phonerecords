import "server-only";
import nodemailer from "nodemailer";

let cached: nodemailer.Transporter | null = null;

function getTransporter() {
  if (cached) return cached;

  const host = process.env.ZOHO_SMTP_HOST ?? "smtp.zoho.com";
  const port = Number(process.env.ZOHO_SMTP_PORT ?? "465");
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      "Missing Zoho SMTP credentials. Set ZOHO_SMTP_USER and ZOHO_SMTP_PASS in environment.",
    );
  }

  cached = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return cached;
}

type SendArgs = {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export async function sendContactMail({ subject, text, html, replyTo }: SendArgs) {
  const transporter = getTransporter();
  const from = process.env.ZOHO_SMTP_FROM ?? process.env.ZOHO_SMTP_USER;
  const to = process.env.ZOHO_SMTP_TO ?? process.env.ZOHO_SMTP_USER;

  await transporter.sendMail({
    from: `PHŌNÉ Records <${from}>`,
    to,
    subject,
    text,
    html,
    replyTo,
  });
}
