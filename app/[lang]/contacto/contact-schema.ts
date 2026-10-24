// Esquema único del formulario de contacto, compartido por el cliente (contact-form.tsx),
// la acción de servidor (actions.ts) y la prueba `scripts/test-contact.mjs`.
// Sin directivas "use client"/"use server" y solo con `zod`, para que Node lo pueda importar.
import { z } from "zod";

export const topicValues = ["general", "booking", "prensa", "sello", "propuesta"] as const;
export type Topic = (typeof topicValues)[number];

/** URLs `https://` con host con punto, en cualquier posición del texto (separadas por espacio, coma o punto y coma). */
export const extractHttpsUrls = (text: string): string[] =>
  text
    .split(/[\s,;]+/)
    .map((token) => token.replace(/^[(<\["'«]+/, "").replace(/[)>\]"'».,:!?]+$/, ""))
    .filter((token) => {
      try {
        const url = new URL(token);
        return url.protocol === "https:" && url.hostname.includes(".");
      } catch {
        return false;
      }
    });

/** Líneas no vacías del textarea de enlaces, recortadas. */
export const linkLines = (text: string): string[] =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

export const contactFields = z.object({
  name: z.string().trim().min(2, "min").max(120),
  email: z.string().trim().email("email").max(200),
  topic: z.enum(topicValues),
  message: z.string().trim().min(10, "min").max(5000),
  // Solo con topic = "propuesta" (ver proposalRules)
  links: z.string().trim().max(1000).optional(),
  city: z.string().trim().max(120).regex(/^[^\r\n]*$/, "city").optional(),
  // honeypot — debe venir vacío
  website: z.string().max(0).optional().or(z.literal("")),
  // opt-in opcional al newsletter
  newsletter: z.boolean().optional(),
});

/** Con asunto "propuesta": al menos una URL https:// en `links` y una ciudad de ≥ 2 caracteres. */
export const proposalRules = (
  value: { topic: Topic; links?: string; city?: string },
  ctx: z.RefinementCtx,
) => {
  if (value.topic !== "propuesta") return;
  if (extractHttpsUrls(value.links ?? "").length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["links"], message: "links" });
  }
  if ((value.city ?? "").length < 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["city"], message: "city" });
  }
};

/** Lo que valida react-hook-form en el navegador. */
export const contactFormSchema = contactFields.superRefine(proposalRules);

/** Lo que valida la acción de servidor (añade idioma y marca de tiempo del render). */
export const contactActionSchema = contactFields
  .extend({
    lang: z.enum(["es", "en"]).default("es"),
    // epoch ms del render del formulario (tiempo mínimo de llenado, como en el newsletter)
    renderedAt: z.number().int().optional(),
  })
  .superRefine(proposalRules);
