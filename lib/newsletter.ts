import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, hasDb, schema } from "@/lib/db";
import { sendContactMail } from "@/lib/mail";

export const subscribeSchema = z.object({
  // zod 4: recortar y pasar a minúsculas antes de validar el formato.
  email: z.string().trim().toLowerCase().max(200).pipe(z.email()),
  lang: z.enum(["es", "en"]),
  source: z
    .string()
    .max(80)
    .regex(/^(contacto|contacto-form|home|footer|release:[a-z0-9-]+)$/),
  consentText: z.string().trim().min(1).max(500),
  ipHash: z.string().max(128).nullish(),
});

export type SubscribeInput = z.input<typeof subscribeSchema>;

export type SubscribeResult =
  | { ok: true; status: "created" | "already" | "reactivated" | "queued" }
  | { ok: false; error: "invalid" | "unavailable" };

/** IP del cliente: x-real-ip primero (la fija Vercel), luego x-forwarded-for. */
export async function getClientIp(): Promise<string | null> {
  const h = await headers();
  return (
    h.get("x-real-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null
  );
}

/**
 * sha256(IP + sal secreta + día UTC). La IP nunca se guarda.
 * Sin IP o sin SUBSCRIBER_SALT devuelve null (no se guarda un hash con sal pública).
 */
export function hashIp(ip: string | null | undefined): string | null {
  const salt = process.env.SUBSCRIBER_SALT;
  if (!ip || !salt) return null;
  const day = new Date().toISOString().slice(0, 10);
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
      // Solo clase y códigos: el mensaje de DrizzleQueryError copia los parámetros (correo, consentimiento, hash de IP).
      console.error("[newsletter] db upsert failed, falling back to mail", errorInfo(err));
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
    // Sin DB ni correo la alta se perdería: se avisa al usuario y se deja
    // una línea estructurada (email enmascarado) para recuperarla a mano.
    console.error(
      JSON.stringify({
        event: "newsletter_subscription_lost",
        email: maskEmail(data.email),
        lang: data.lang,
        source: data.source,
        at: new Date().toISOString(),
      }),
      errorInfo(err),
    );
    return { ok: false, error: "unavailable" };
  }
  return { ok: true, status: "queued" };
}

/** Un código solo se registra si tiene forma de código (EAUTH, 57P01, ERR_X): nunca texto libre. */
const CODE = /^[A-Za-z0-9_]{1,40}$/;
/** Verbo SMTP de nodemailer ("AUTH PLAIN", "RCPT TO", "DATA", "CONN"…): fijo, sin direcciones. */
const SMTP_COMMAND = /^[A-Z][A-Z0-9 -]{0,30}$/;

/**
 * Resumen de un error para console.error: clase y códigos, nunca el mensaje, la respuesta ni los
 * parámetros. nodemailer copia ahí la respuesta del servidor SMTP y las direcciones, y
 * DrizzleQueryError los parámetros de la consulta (correo, texto de consentimiento, hash de IP).
 */
export function errorInfo(err: unknown): Record<string, string | number> {
  if (!(err instanceof Error)) return { type: err === null ? "null" : typeof err };
  const e = err as Error & {
    code?: unknown;
    originalCode?: unknown;
    responseCode?: unknown;
    command?: unknown;
  };
  const cause = (typeof e.cause === "object" && e.cause !== null ? e.cause : {}) as { code?: unknown };
  const className = e.constructor?.name || e.name;
  const info: Record<string, string | number> = { name: CODE.test(className) ? className : "Error" };
  if (typeof e.code === "string" && CODE.test(e.code)) info.code = e.code;
  // nodemailer guarda aquí el código de sistema que envolvió (ECONNREFUSED, ENOTFOUND…).
  if (typeof e.originalCode === "string" && CODE.test(e.originalCode)) info.originalCode = e.originalCode;
  if (typeof e.responseCode === "number") info.responseCode = e.responseCode;
  if (typeof e.command === "string" && SMTP_COMMAND.test(e.command)) info.command = e.command;
  // SQLSTATE de Postgres o código de sistema en la causa.
  if (typeof cause.code === "string" && CODE.test(cause.code)) info.causeCode = cause.code;
  return info;
}

function maskEmail(email: string): string {
  const [local = "", domain = ""] = email.split("@");
  return `${local.slice(0, 1)}***@${domain}`;
}
