"use server";

import { z } from "zod";
import { sendContactMail } from "@/lib/mail";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  topic: z.enum(["general", "booking", "prensa", "sello"]),
  message: z.string().trim().min(10).max(5000),
  // honeypot — must remain empty
  website: z.string().max(0).optional().or(z.literal("")),
  lang: z.enum(["es", "en"]).default("es"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { ok: true }
  | { ok: false; error: "invalid" | "send_failed"; details?: string };

const topicLabels = {
  general: { es: "General", en: "General" },
  booking: { es: "Booking", en: "Booking" },
  prensa: { es: "Prensa", en: "Press" },
  sello: { es: "Sello", en: "Label" },
} as const;

export async function sendContactMessage(
  raw: unknown,
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }

  const { name, email, topic, message, website, lang } = parsed.data;

  // Honeypot tripped: silently succeed so bots don't get signal.
  if (website && website.length > 0) {
    return { ok: true };
  }

  const topicLabel = topicLabels[topic][lang];
  const subject = `[phonerecords.cl] ${topicLabel} · ${name}`;

  const text = [
    `Nuevo mensaje desde phonerecords.cl`,
    ``,
    `Nombre:   ${name}`,
    `Email:    ${email}`,
    `Asunto:   ${topicLabel}`,
    `Idioma:   ${lang}`,
    ``,
    `Mensaje:`,
    message,
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px;">
      <h2 style="margin:0 0 16px;font-size:16px;font-weight:600;">Nuevo mensaje desde phonerecords.cl</h2>
      <table style="border-collapse:collapse;font-size:14px;line-height:1.5;">
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Nombre</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Asunto</td><td>${escapeHtml(topicLabel)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Idioma</td><td>${lang}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
      <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;margin:0;">${escapeHtml(message)}</pre>
    </div>
  `;

  try {
    await sendContactMail({ subject, text, html, replyTo: email });
    return { ok: true };
  } catch (err) {
    console.error("[contact] sendMail failed", err);
    return {
      ok: false,
      error: "send_failed",
      details: err instanceof Error ? err.message : String(err),
    };
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
