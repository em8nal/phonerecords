"use server";

import { z } from "zod";
import { getClientIp, hashIp, subscribe } from "@/lib/newsletter";
import { translations } from "@/lib/translations";

const MIN_FILL_MS = 2000;

const inputSchema = z.object({
  email: z.string().trim().max(200),
  lang: z.enum(["es", "en"]),
  source: z.enum(["contacto", "home"]),
  // honeypot: debe venir vacío
  website: z.string().max(200).optional().default(""),
  // epoch ms del render del formulario
  renderedAt: z.number().int().optional(),
});

export type SubscribeActionResult =
  | { ok: true; status: "created" | "already" | "reactivated" | "queued" }
  | { ok: false; error: "invalid" | "unavailable" };

export async function subscribeAction(
  raw: unknown,
): Promise<SubscribeActionResult> {
  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { email, lang, source, website, renderedAt } = parsed.data;

  // Honeypot lleno: éxito silencioso, sin guardar.
  if (website.length > 0) return { ok: true, status: "queued" };
  // Envío demasiado rápido: error genérico (una persona puede reintentar).
  if (!renderedAt || Date.now() - renderedAt < MIN_FILL_MS) {
    return { ok: false, error: "unavailable" };
  }

  const ip = await getClientIp();

  try {
    const res = await subscribe({
      email,
      lang,
      source,
      consentText: translations[lang].newsletter.consent,
      ipHash: hashIp(ip),
    });
    // El status interno (created/already/reactivated) solo va al log:
    // la UI responde igual para no permitir enumerar suscriptores.
    if (res.ok) console.info("[newsletter] subscribe", source, res.status);
    return res.ok ? { ok: true, status: "queued" } : res;
  } catch (err) {
    console.error("[newsletter] action failed", err);
    return { ok: false, error: "unavailable" };
  }
}
