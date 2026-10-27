"use server";

import type { z } from "zod";
import { sendContactMail } from "@/lib/mail";
import { getClientIp, hashIp, subscribe } from "@/lib/newsletter";
import { translations } from "@/lib/translations";
import {
  contactActionSchema,
  extractHttpsUrls,
  linkLines,
  projectTypeLabels,
  serviceInterestLabels,
} from "./contact-schema";

// Envío en menos de este tiempo desde el render = bot (mismo umbral que app/actions/newsletter.ts).
const MIN_FILL_MS = 2000;

export type ContactInput = z.infer<typeof contactActionSchema>;

export type ContactResult =
  | { ok: true }
  | { ok: false; error: "invalid" | "send_failed"; details?: string };

const topicLabels = {
  general: { es: "General", en: "General" },
  booking: { es: "Booking", en: "Booking" },
  prensa: { es: "Prensa", en: "Press" },
  sello: { es: "Sello", en: "Label" },
  propuesta: { es: "Propuesta de artista", en: "Artist proposal" },
  servicios: { es: "Dirección creativa, diseño y prensa", en: "Creative direction, design & press" },
} as const;

export async function sendContactMessage(
  raw: unknown,
): Promise<ContactResult> {
  const parsed = contactActionSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }

  const {
    name,
    email,
    topic,
    message,
    links,
    city,
    services,
    projectType,
    releaseWindow,
    website,
    lang,
    newsletter,
    renderedAt,
  } = parsed.data;

  // Honeypot tripped: silently succeed so bots don't get signal.
  if (website && website.length > 0) {
    return { ok: true };
  }

  // Demasiado rápido: error genérico (una persona reintenta; un bot no obtiene señal útil).
  // Delta negativo = reloj del cliente adelantado: no se puede medir, se deja pasar (el honeypot sigue activo).
  const elapsed = renderedAt ? Date.now() - renderedAt : -1;
  if (!renderedAt || (elapsed >= 0 && elapsed < MIN_FILL_MS)) {
    return { ok: false, error: "send_failed" };
  }

  const isProposal = topic === "propuesta";
  const isServices = topic === "servicios";
  const hasLinks = isProposal || isServices;
  const topicLabel = topicLabels[topic][lang];
  // Sin saltos de línea ni espacios dobles: van en la cabecera Subject.
  const nameClean = name.replace(/\s+/g, " ");
  const cityClean = (city ?? "").replace(/\s+/g, " ");
  const linkList = hasLinks ? linkLines(links ?? "") : [];
  // Asunto "servicios": etiquetas en español (el correo es interno), sin duplicados.
  const servicesClean = isServices
    ? [...new Set(services ?? [])].map((s) => serviceInterestLabels[s].es).join(" · ")
    : "";
  const projectClean = isServices && projectType ? projectTypeLabels[projectType].es : "";
  const releaseClean = (releaseWindow ?? "").replace(/\s+/g, " ").trim() || "(sin indicar)";

  const subject = isProposal
    ? `[phonerecords.cl] Propuesta de artista — ${nameClean} (${cityClean})`
    : isServices
      ? `[phonerecords.cl] Cotización de servicios — ${nameClean}`
      : `[phonerecords.cl] ${topicLabel} · ${nameClean}`;

  const text = [
    `Nuevo mensaje desde phonerecords.cl`,
    ``,
    `Nombre:   ${name}`,
    `Email:    ${email}`,
    `Asunto:   ${topicLabel}`,
    `Idioma:   ${lang}`,
    ...(isProposal ? [`Ciudad:   ${cityClean}`] : []),
    ...(isServices
      ? [
          `Servicios: ${servicesClean}`,
          `Proyecto: ${projectClean}`,
          `Fecha estimada: ${releaseClean}`,
        ]
      : []),
    ...(hasLinks
      ? [
          ``,
          `Enlaces:`,
          ...(linkList.length > 0 ? linkList.map((line) => `  ${line}`) : [`  (sin indicar)`]),
        ]
      : []),
    ``,
    `Mensaje:`,
    message,
  ].join("\n");

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666;">${label}</td><td>${escapeHtml(value)}</td></tr>`;
  const cityRow = isProposal ? row("Ciudad", cityClean) : "";
  const servicesRows = isServices
    ? [row("Servicios", servicesClean), row("Proyecto", projectClean), row("Fecha estimada", releaseClean)].join("\n        ")
    : "";
  // Cada línea del textarea es un <li>; si contiene una URL https://, la línea entera enlaza a ella.
  const linkItems =
    linkList.length > 0
      ? linkList
          .map((line) => {
            const [url] = extractHttpsUrls(line);
            return url
              ? `<li><a href="${escapeHtml(url)}">${escapeHtml(line)}</a></li>`
              : `<li>${escapeHtml(line)}</li>`;
          })
          .join("\n        ")
      : `<li>(sin indicar)</li>`;
  const linksBlock = hasLinks
    ? `
      <p style="margin:16px 0 4px;font-size:14px;color:#666;">Enlaces</p>
      <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.6;">
        ${linkItems}
      </ul>`
    : "";

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px;">
      <h2 style="margin:0 0 16px;font-size:16px;font-weight:600;">Nuevo mensaje desde phonerecords.cl</h2>
      <table style="border-collapse:collapse;font-size:14px;line-height:1.5;">
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Nombre</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Asunto</td><td>${escapeHtml(topicLabel)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Idioma</td><td>${lang}</td></tr>
        ${cityRow}${servicesRows}
      </table>${linksBlock}
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
      <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;margin:0;">${escapeHtml(message)}</pre>
    </div>
  `;

  try {
    await sendContactMail({ subject, text, html, replyTo: email });
  } catch (err) {
    console.error("[contact] sendMail failed", err);
    return {
      ok: false,
      error: "send_failed",
      details: err instanceof Error ? err.message : String(err),
    };
  }

  // Opt-in opcional: si falla, se registra y el contacto igual se da por enviado.
  if (newsletter === true) {
    try {
      const ip = await getClientIp();
      const res = await subscribe({
        email,
        lang,
        source: "contacto-form",
        consentText: translations[lang].newsletter.checkbox,
        ipHash: hashIp(ip),
      });
      if (!res.ok) console.error("[contact] newsletter opt-in rejected", res.error);
    } catch (err) {
      console.error("[contact] newsletter opt-in failed", err);
    }
  }

  return { ok: true };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
