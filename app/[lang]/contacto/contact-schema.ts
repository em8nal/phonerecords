// Esquema único del formulario de contacto, compartido por el cliente (contact-form.tsx),
// la acción de servidor (actions.ts) y la prueba `scripts/test-contact.mjs`.
// Sin directivas "use client"/"use server" y solo con `zod`, para que Node lo pueda importar.
import { z } from "zod";

export const topicValues = ["general", "booking", "prensa", "sello", "propuesta", "servicios"] as const;
export type Topic = (typeof topicValues)[number];

type Localized = { es: string; en: string };

/** Casillas "Servicios de interés" del asunto "servicios" (dirección creativa, diseño y prensa). */
export const serviceInterestValues = [
  "direccion",
  "portada",
  "kit",
  "animaciones",
  "sesion",
  "prensa",
  "por-definir",
] as const;
export type ServiceInterest = (typeof serviceInterestValues)[number];

export const serviceInterestLabels: Record<ServiceInterest, Localized> = {
  direccion: { es: "Dirección creativa y planificación", en: "Creative direction and planning" },
  portada: { es: "Portada e ilustración", en: "Cover and illustration" },
  kit: { es: "Kit gráfico", en: "Graphic kit" },
  animaciones: { es: "Animaciones", en: "Animations" },
  sesion: { es: "Sesión fotográfica y video", en: "Photo session and video" },
  prensa: { es: "Prensa", en: "Press" },
  "por-definir": { es: "Todavía no lo tengo claro", en: "I'm not sure yet" },
};

/** Tipo de proyecto del asunto "servicios". */
export const projectTypeValues = ["single", "ep", "disco", "otro"] as const;
export type ProjectType = (typeof projectTypeValues)[number];

export const projectTypeLabels: Record<ProjectType, Localized> = {
  single: { es: "Single", en: "Single" },
  ep: { es: "EP", en: "EP" },
  disco: { es: "Disco", en: "Album" },
  otro: { es: "Otro", en: "Other" },
};

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
  // Enlaces: obligatorios con topic = "propuesta" (ver proposalRules), opcionales con "servicios".
  // Ciudad: solo con "propuesta".
  links: z.string().trim().max(1000).optional(),
  city: z.string().trim().max(120).regex(/^[^\r\n]*$/, "city").optional(),
  // Solo con topic = "servicios" (ver servicesRules). Sin campo de presupuesto, a propósito.
  services: z.array(z.enum(serviceInterestValues)).max(serviceInterestValues.length).optional(),
  // react-hook-form entrega null con los radios sin marcar.
  projectType: z.enum(projectTypeValues).nullish(),
  releaseWindow: z.string().trim().max(60).regex(/^[^\r\n]*$/, "releaseWindow").optional(),
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

/** Con asunto "servicios": al menos un servicio de interés y el tipo de proyecto (fecha y enlaces, opcionales). */
export const servicesRules = (
  value: { topic: Topic; services?: readonly ServiceInterest[]; projectType?: ProjectType | null },
  ctx: z.RefinementCtx,
) => {
  if (value.topic !== "servicios") return;
  if (!value.services || value.services.length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["services"], message: "services" });
  }
  if (!value.projectType) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["projectType"], message: "projectType" });
  }
};

/** Reglas por asunto, comunes al cliente y a la acción. */
const contactRules = (value: z.infer<typeof contactFields>, ctx: z.RefinementCtx) => {
  proposalRules(value, ctx);
  servicesRules(value, ctx);
};

/** Lo que valida react-hook-form en el navegador. */
export const contactFormSchema = contactFields.superRefine(contactRules);

/** Lo que valida la acción de servidor (añade idioma y marca de tiempo del render). */
export const contactActionSchema = contactFields
  .extend({
    lang: z.enum(["es", "en"]).default("es"),
    // epoch ms del render del formulario (tiempo mínimo de llenado, como en el newsletter)
    renderedAt: z.number().int().optional(),
  })
  .superRefine(contactRules);
