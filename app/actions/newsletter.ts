"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { hashIp, subscribe } from "@/lib/newsletter";
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

  // Bots: honeypot lleno o envío demasiado rápido. Éxito silencioso, sin guardar.
  const tooFast = !renderedAt || Date.now() - renderedAt < MIN_FILL_MS;
  if (website.length > 0 || tooFast) {
    return { ok: true, status: "queued" };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip");

  try {
    return await subscribe({
      email,
      lang,
      source,
      consentText: translations[lang].newsletter.consent,
      ipHash: hashIp(ip),
    });
  } catch (err) {
    console.error("[newsletter] action failed", err);
    return { ok: false, error: "unavailable" };
  }
}
