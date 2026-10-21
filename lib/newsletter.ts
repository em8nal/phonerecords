import "server-only";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, hasDb, schema } from "@/lib/db";
import { sendContactMail } from "@/lib/mail";

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  lang: z.enum(["es", "en"]),
  source: z
    .string()
    .max(80)
    .regex(/^(contacto|contacto-form|home|release:[a-z0-9-]+)$/),
  consentText: z.string().trim().min(1).max(500),
  ipHash: z.string().max(128).nullish(),
});

export type SubscribeInput = z.input<typeof subscribeSchema>;

export type SubscribeResult =
  | { ok: true; status: "created" | "already" | "reactivated" | "queued" }
  | { ok: false; error: "invalid" | "unavailable" };

/** sha256(IP + sal diaria). La IP nunca se guarda. Devuelve null sin IP. */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.SUBSCRIBER_SALT ?? "";
  return createHash("sha256").update(`${ip}|${salt}|${day}`).digest("hex");
}

export async function subscribe(input: SubscribeInput): Promise<SubscribeResult> {
  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const data = parsed.data;

  if (hasDb()) {
    try {
      return { ok: true, status: await upsertSubscriber(data) };
    } catch (err) {
      // Nunca exponemos detalles al cliente; probamos el respaldo por correo.
      console.error("[newsletter] db upsert failed, falling back to mail", err);
    }
  }

  return queueByMail(data);
}

type Parsed = z.output<typeof subscribeSchema>;

async function upsertSubscriber(
  data: Parsed,
): Promise<"created" | "already" | "reactivated"> {
  const db = getDb();
  const { subscribers } = schema;
  const now = new Date();

  const [existing] = await db
    .select({ id: subscribers.id, status: subscribers.status })
    .from(subscribers)
    .where(eq(subscribers.email, data.email))
    .limit(1);

  if (!existing) {
    const inserted = await db
      .insert(subscribers)
      .values({
        email: data.email,
        lang: data.lang,
        source: data.source,
        status: "subscribed",
        consentText: data.consentText,
        consentAt: now,
        ipHash: data.ipHash ?? null,
      })
      .onConflictDoNothing({ target: subscribers.email })
      .returning({ id: subscribers.id });
    return inserted.length > 0 ? "created" : "already";
  }

  if (existing.status === "unsubscribed") {
    await db
      .update(subscribers)
      .set({
        status: "subscribed",
        lang: data.lang,
        consentText: data.consentText,
        consentAt: now,
        updatedAt: now,
        unsubscribedAt: null,
        ipHash: data.ipHash ?? null,
      })
      .where(eq(subscribers.id, existing.id));
    return "reactivated";
  }

  return "already";
}

async function queueByMail(data: Parsed): Promise<SubscribeResult> {
  const lines = [
    "Nueva suscripción newsletter",
    "",
    `Email:       ${data.email}`,
    `Idioma:      ${data.lang}`,
    `Origen:      ${data.source}`,
    `Consentimiento: ${data.consentText}`,
    `Fecha:       ${new Date().toISOString()}`,
    `Hash de IP:  ${data.ipHash ?? "—"}`,
  ];
  try {
    await sendContactMail({
      subject: "Nueva suscripción newsletter",
      text: lines.join("\n"),
      replyTo: data.email,
    });
  } catch (err) {
    // El usuario ve éxito: el fallo queda solo en el log del servidor.
    console.error("[newsletter] fallback mail failed", err);
  }
  return { ok: true, status: "queued" };
}
