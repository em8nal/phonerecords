// Prueba del esquema del formulario de contacto (asuntos "propuesta" y "servicios"):
//   node --import ./scripts/ts-resolve-hook.mjs scripts/test-contact.mjs
// Importa app/[lang]/contacto/contact-schema.ts (solo zod, sin directivas) y comprueba
// que los campos extra se exigen solo con su asunto: enlaces y ciudad con "propuesta";
// servicios de interés y tipo de proyecto con "servicios" (fecha estimada y enlaces, opcionales).
// Al final corre las server actions reales (contacto y newsletter) con dobles de la base y del SMTP:
// el navegador recibe solo { ok, error | status } y los logs no llevan mensajes ni datos personales.
import { deepStrictEqual } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { inspect } from "node:util";
import {
  contactActionSchema,
  contactFormSchema,
  extractHttpsUrls,
  linkLines,
  projectTypeLabels,
  projectTypeValues,
  serviceInterestLabels,
  serviceInterestValues,
  topicValues,
} from "../app/[lang]/contacto/contact-schema.ts";

let ok = true;
const report = (label, pass, detail) => {
  ok &&= pass;
  console.log(`${pass ? "OK  " : "FAIL"} ${label}${detail ? " -> " + detail : ""}`);
};

const base = {
  name: "Ana Prueba",
  email: "ana@example.com",
  message: "Hola, escribo para contarles de un proyecto nuevo.",
  website: "",
  newsletter: false,
};

const issuePaths = (result) =>
  result.success ? [] : result.error.issues.map((i) => i.path.join("."));
const failsOnlyAt = (result, ...paths) =>
  !result.success &&
  JSON.stringify([...new Set(issuePaths(result))].sort()) === JSON.stringify([...paths].sort());

report(
  "topicValues = los 5 anteriores + servicios",
  JSON.stringify(topicValues) === JSON.stringify(["general", "booking", "prensa", "sello", "propuesta", "servicios"]),
  JSON.stringify(topicValues),
);

// (1) general sin links/city ⇒ ok
const r1 = contactActionSchema.safeParse({ ...base, topic: "general" });
report("general sin links/city ⇒ ok", r1.success, issuePaths(r1).join(","));

// (1b) general con links basura ⇒ ok igual (no se valida fuera de propuesta)
const r1b = contactActionSchema.safeParse({ ...base, topic: "booking", links: "nada", city: "" });
report("booking con links/city inválidos ⇒ ok (no se validan)", r1b.success, issuePaths(r1b).join(","));

// (2) propuesta sin links ⇒ falla en links (y city vacía ⇒ también city)
const r2 = contactActionSchema.safeParse({ ...base, topic: "propuesta", city: "Santiago" });
report("propuesta sin links ⇒ falla solo en links", failsOnlyAt(r2, "links"), issuePaths(r2).join(","));

// (3) links sin https:// ⇒ falla en links
const r3 = contactActionSchema.safeParse({
  ...base,
  topic: "propuesta",
  links: "open.spotify.com/artist/x",
  city: "Santiago",
});
report("links sin https:// ⇒ falla solo en links", failsOnlyAt(r3, "links"), issuePaths(r3).join(","));

// (3b) http:// ⇒ falla en links
const r3b = contactActionSchema.safeParse({
  ...base,
  topic: "propuesta",
  links: "http://open.spotify.com/artist/x",
  city: "Santiago",
});
report("links http:// ⇒ falla solo en links", failsOnlyAt(r3b, "links"), issuePaths(r3b).join(","));

// (4) una URL https + una línea sin URL, ciudad ⇒ ok
const r4 = contactActionSchema.safeParse({
  ...base,
  topic: "propuesta",
  links: "https://open.spotify.com/artist/x\nIG: @x",
  city: "Valparaíso",
});
report("propuesta válida (1 https + línea libre) ⇒ ok", r4.success, issuePaths(r4).join(","));
report(
  "propuesta válida: lang por defecto es",
  r4.success && r4.data.lang === "es" && r4.data.topic === "propuesta",
);

// (4b) "Spotify: https://…" en la misma línea ⇒ ok
const r4b = contactActionSchema.safeParse({
  ...base,
  topic: "propuesta",
  links: "Spotify: https://open.spotify.com/artist/x",
  city: "Concepción",
});
report("'Spotify: https://…' en una línea ⇒ ok", r4b.success, issuePaths(r4b).join(","));

// (5) válida salvo city vacía ⇒ falla en city
const r5 = contactActionSchema.safeParse({
  ...base,
  topic: "propuesta",
  links: "https://open.spotify.com/artist/x",
  city: "",
});
report("propuesta con city vacía ⇒ falla solo en city", failsOnlyAt(r5, "city"), issuePaths(r5).join(","));

// (5b) city con salto de línea ⇒ falla en city (cabecera del correo)
const r5b = contactActionSchema.safeParse({
  ...base,
  topic: "propuesta",
  links: "https://open.spotify.com/artist/x",
  city: "Santiago\nBcc: x@y.z",
});
report("city con salto de línea ⇒ falla en city", !r5b.success && issuePaths(r5b).includes("city"), issuePaths(r5b).join(","));

// (6) topic desconocido ⇒ falla
const r6 = contactActionSchema.safeParse({ ...base, topic: "otro" });
report("topic desconocido ⇒ falla en topic", failsOnlyAt(r6, "topic"), issuePaths(r6).join(","));

// (6b) honeypot lleno ⇒ el esquema lo acepta (la acción decide antes de validar: ver el caso 24),
// también en el navegador, para que el formulario no se trabe sin mostrar error
for (const [label, schema] of [["acción", contactActionSchema], ["formulario", contactFormSchema]]) {
  const r6b = schema.safeParse({ ...base, topic: "general", website: "http://spam" });
  report(`${label}: honeypot lleno ⇒ el esquema lo acepta`, r6b.success, issuePaths(r6b).join(","));
}

// (7) extractHttpsUrls: solo https con host con punto
const urls = extractHttpsUrls("Spotify: https://a.b/c, http://x.y https://localhost/z");
report("extractHttpsUrls filtra http:// y hosts sin punto", JSON.stringify(urls) === JSON.stringify(["https://a.b/c"]), JSON.stringify(urls));

// (8) linkLines: recorta y descarta vacías
const lines = linkLines("  https://a.b/c \r\n\n IG: @x \n");
report("linkLines recorta y descarta vacías", JSON.stringify(lines) === JSON.stringify(["https://a.b/c", "IG: @x"]), JSON.stringify(lines));

// (9) el esquema del cliente aplica las mismas reglas (sin lang/renderedAt)
const r9 = contactFormSchema.safeParse({ ...base, topic: "propuesta", links: "", city: "" });
report("contactFormSchema: propuesta vacía ⇒ falla en links y city", failsOnlyAt(r9, "links", "city"), issuePaths(r9).join(","));
const r9b = contactFormSchema.safeParse({ ...base, topic: "sello" });
report("contactFormSchema: sello sin extras ⇒ ok", r9b.success, issuePaths(r9b).join(","));

// ── Asunto "servicios" (dirección creativa, diseño y prensa) ──
const servicios = { ...base, topic: "servicios", services: ["portada", "prensa"], projectType: "ep" };

// (10) válido con dos servicios y tipo ⇒ ok
const s1 = contactActionSchema.safeParse(servicios);
report("servicios válido (2 casillas + EP) ⇒ ok", s1.success, issuePaths(s1).join(","));

// (11) sin servicios marcados ⇒ falla solo en services (sin campo y con arreglo vacío)
const { services: _omit, ...withoutServices } = servicios;
const s2 = contactActionSchema.safeParse(withoutServices);
report("servicios sin casillas (campo ausente) ⇒ falla solo en services", failsOnlyAt(s2, "services"), issuePaths(s2).join(","));
const s2b = contactActionSchema.safeParse({ ...servicios, services: [] });
report("servicios con casillas vacías ([]) ⇒ falla solo en services", failsOnlyAt(s2b, "services"), issuePaths(s2b).join(","));

// (12) sin tipo de proyecto (null = radios sin marcar) ⇒ falla solo en projectType
const s3 = contactActionSchema.safeParse({ ...servicios, projectType: null });
report("servicios sin tipo de proyecto ⇒ falla solo en projectType", failsOnlyAt(s3, "projectType"), issuePaths(s3).join(","));

// (13) fecha estimada en texto libre ⇒ ok; sin fecha ⇒ ok; con salto de línea ⇒ falla
const s4 = contactActionSchema.safeParse({ ...servicios, releaseWindow: "marzo 2027" });
report("servicios con fecha en texto ('marzo 2027') ⇒ ok", s4.success && s4.data.releaseWindow === "marzo 2027", issuePaths(s4).join(","));
const s4b = contactActionSchema.safeParse({ ...servicios, releaseWindow: "" });
report("servicios con fecha vacía ⇒ ok (opcional)", s4b.success, issuePaths(s4b).join(","));
const s4c = contactActionSchema.safeParse({ ...servicios, releaseWindow: "marzo\nBcc: x@y.z" });
report("fecha con salto de línea ⇒ falla en releaseWindow", failsOnlyAt(s4c, "releaseWindow"), issuePaths(s4c).join(","));

// (14) enlaces opcionales y sin exigir https:// (a diferencia de "propuesta")
const s5 = contactActionSchema.safeParse({ ...servicios, links: "maqueta en Drive\nIG: @x" });
report("servicios con enlaces sin https:// ⇒ ok", s5.success, issuePaths(s5).join(","));

// (15) casilla desconocida ⇒ falla en services.0; "Todavía no lo tengo claro" vale sola
const s6 = contactActionSchema.safeParse({ ...servicios, services: ["xyz"] });
report("servicio desconocido ⇒ falla solo en services.0", failsOnlyAt(s6, "services.0"), issuePaths(s6).join(","));
const s6b = contactActionSchema.safeParse({ ...servicios, services: ["por-definir"], projectType: "otro" });
report("'Todavía no lo tengo claro' + Otro ⇒ ok", s6b.success, issuePaths(s6b).join(","));

// (16) otros asuntos no exigen los campos de servicios ni la ciudad
const s7 = contactActionSchema.safeParse({ ...base, topic: "booking", services: [], projectType: null });
report("booking sin campos de servicios ⇒ ok", s7.success, issuePaths(s7).join(","));
const s7b = contactActionSchema.safeParse({ ...servicios, city: "" });
report("servicios no exige ciudad", s7b.success, issuePaths(s7b).join(","));

// (17) el esquema del cliente aplica las mismas reglas
const s8 = contactFormSchema.safeParse({ ...base, topic: "servicios", services: [], projectType: null, releaseWindow: "" });
report("contactFormSchema: servicios vacío ⇒ falla en services y projectType", failsOnlyAt(s8, "services", "projectType"), issuePaths(s8).join(","));
const s8b = contactFormSchema.safeParse(servicios);
report("contactFormSchema: servicios válido ⇒ ok", s8b.success, issuePaths(s8b).join(","));

// (18) etiquetas ES/EN para cada casilla y cada tipo (sin presupuesto ni cifras)
const missingLabels = [
  ...serviceInterestValues.filter((v) => !serviceInterestLabels[v]?.es || !serviceInterestLabels[v]?.en),
  ...projectTypeValues.filter((v) => !projectTypeLabels[v]?.es || !projectTypeLabels[v]?.en),
];
report("etiquetas ES/EN de casillas y tipos", missingLabels.length === 0, missingLabels.join(", "));
report(
  "7 casillas (con 'Todavía no lo tengo claro') y 4 tipos",
  serviceInterestValues.length === 7 &&
    serviceInterestLabels["por-definir"].es === "Todavía no lo tengo claro" &&
    JSON.stringify(projectTypeValues) === JSON.stringify(["single", "ep", "disco", "otro"]),
);
report(
  "sin campo de presupuesto en el esquema",
  // zod 4: superRefine devuelve el mismo ZodObject (ya no hay ZodEffects con _def.schema).
  !Object.keys(contactActionSchema.shape).some((k) => /budget|presupuesto|monto|amount/i.test(k)),
);

// ── zod 4: casos que la migración no puede romper ──
// (19) GHSA-mrhx-c7xc-m3w5: un arreglo enorme se corta por el largo, sin validar cada elemento.
const big = contactActionSchema.safeParse({ ...servicios, services: Array(10000).fill("xyz") });
report(
  "10 000 servicios inválidos ⇒ un solo error too_big en services",
  !big.success && big.error.issues.length === 1 && big.error.issues[0].code === "too_big" && issuePaths(big)[0] === "services",
  big.success ? "" : `${big.error.issues.length} issues`,
);
// (20) el correo se recorta antes de validar el formato (z.email().trim() lo rechazaría)
for (const [label, schema] of [["acción", contactActionSchema], ["formulario", contactFormSchema]]) {
  const r = schema.safeParse({ ...base, topic: "general", email: "  ana@example.com " });
  report(`${label}: correo con espacios ⇒ ok y recortado`, r.success && r.data.email === "ana@example.com", issuePaths(r).join(","));
}
// (21) los errores de campo no impiden las reglas por asunto (se ven todos a la vez)
const multi = contactFormSchema.safeParse({ ...base, name: "A", topic: "propuesta", links: "", city: "" });
report("nombre corto + propuesta vacía ⇒ name, links y city", failsOnlyAt(multi, "name", "links", "city"), issuePaths(multi).join(","));

// ── Server actions: nada interno al navegador, nada personal en los logs ──
// Corre las acciones reales y lib/newsletter.ts; solo se reemplazan los bordes (server-only, next/headers,
// drizzle-orm, @/lib/db y @/lib/mail), así que nunca se envía un correo ni se toca la base.
// Por qué así y no un chequeo de tipos: el tipo no ve lo que viaja en ejecución, y una función pura
// no prueba que la acción la use. Si una acción importa un módulo @/ nuevo con efectos, súmalo a STUBS.
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const stub = (src) => "data:text/javascript," + encodeURIComponent(src);
const K = (globalThis.__K = { db: "off", failMail: () => false, sent: [] });
const SECRET = "SECRETO-SMTP";
const STUBS = {
  "server-only": stub("export {};"),
  "next/headers": stub(
    'export async function headers() { if (globalThis.__K.headersFail) throw new Error("headers ana@example.com"); return new Headers({ "x-real-ip": "203.0.113.7" }); }',
  ),
  "drizzle-orm": stub("export const eq = () => ({});"),
  // Como DrizzleQueryError: el mensaje copia los parámetros de la consulta; la causa trae el SQLSTATE.
  "@/lib/db": stub(`export const hasDb = () => globalThis.__K.db !== "off";
export const schema = { subscribers: {} };
export function getDb() {
  const e = new Error("Failed query: insert into subscribers\\nparams: ana@example.com,es,home");
  e.cause = { code: "57P01" };
  throw e;
}`),
  // Como nodemailer: el mensaje y response copian la respuesta del servidor y la dirección.
  "@/lib/mail": stub(`export async function sendContactMail(m) {
  globalThis.__K.sent.push(m);
  if (globalThis.__K.failMail(m)) {
    const e = new Error("535 Authentication failed ${SECRET} " + m.replyTo);
    Object.assign(e, { code: "EAUTH", responseCode: 535, command: "AUTH PLAIN", response: "535 ${SECRET} " + m.replyTo });
    throw e;
  }
}`),
};
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (STUBS[specifier]) return { url: STUBS[specifier], format: "module", shortCircuit: true };
    if (specifier.startsWith("@/") && existsSync(`${ROOT}${specifier.slice(2)}.ts`)) {
      return nextResolve(pathToFileURL(`${ROOT}${specifier.slice(2)}.ts`).href, context);
    }
    return nextResolve(specifier, context);
  },
});
const load = (p) => import(pathToFileURL(ROOT + p).href);
const { sendContactMessage } = await load("app/[lang]/contacto/actions.ts");
const { subscribeAction } = await load("app/actions/newsletter.ts");
const { errorInfo, subscribe } = await load("lib/newsletter.ts");

const same = (a, b) => {
  try {
    deepStrictEqual(a, b);
    return true;
  } catch {
    return false;
  }
};
// Ejecuta fn capturando console.error/info tal como los verían los logs de Vercel (util.inspect).
const run = async (fn) => {
  const logs = [];
  const { error, info } = console;
  console.error = console.info = (...args) =>
    logs.push(args.map((a) => (typeof a === "string" ? a : inspect(a, { depth: 5 }))).join(" "));
  try {
    return { res: await fn(), log: logs.join("\n"), mails: K.sent.splice(0) };
  } finally {
    Object.assign(console, { error, info });
  }
};
const leaks = (text) => [SECRET, "ana@example.com", "params:", "ZOHO_"].filter((s) => text.includes(s));
const form = { ...base, topic: "general", lang: "es" };
const old = () => Date.now() - 5000;

// (22) SMTP falla ⇒ el cliente recibe exactamente { ok: false, error: "send_failed" }; el log, solo códigos
K.failMail = () => true;
let c = await run(() => sendContactMessage({ ...form, renderedAt: old() }));
report("contacto, SMTP falla ⇒ { ok:false, error:'send_failed' } sin details", same(c.res, { ok: false, error: "send_failed" }), JSON.stringify(c.res));
report("contacto, SMTP falla ⇒ log con EAUTH y sin correo ni mensaje", c.log.includes("EAUTH") && leaks(c.log).length === 0, leaks(c.log).join(","));
K.failMail = () => false;

// (23) envío correcto ⇒ { ok: true } y el correo sale con su asunto y reply-to
c = await run(() => sendContactMessage({ ...form, renderedAt: old() }));
report(
  "contacto válido ⇒ { ok:true } y un correo con reply-to",
  same(c.res, { ok: true }) && c.mails.length === 1 && c.mails[0].replyTo === form.email && c.mails[0].subject === "[phonerecords.cl] General · Ana Prueba",
  JSON.stringify(c.res),
);

// (24) honeypot, envío rápido e inválido: respuesta fija y ningún correo.
// El honeypot se revisa antes de validar: éxito silencioso aunque el resto sea inválido (24b) y sin
// suscribir aunque marque el newsletter (24c: con la base apagada, suscribir enviaría el respaldo
// por correo, así que 0 correos prueba que no se suscribe).
for (const [label, input, expected] of [
  ["honeypot lleno", { ...form, website: "http://spam", renderedAt: old() }, { ok: true }],
  ["honeypot lleno + correo inválido y sin renderedAt (24b)", { ...form, website: "http://spam", email: "ana@" }, { ok: true }],
  ["honeypot lleno + newsletter (24c)", { ...form, website: "http://spam", newsletter: true, renderedAt: old() }, { ok: true }],
  ["envío en < 2 s", { ...form, renderedAt: Date.now() }, { ok: false, error: "send_failed" }],
  ["correo inválido", { ...form, email: "ana@", renderedAt: old() }, { ok: false, error: "invalid" }],
]) {
  c = await run(() => sendContactMessage(input));
  report(`contacto, ${label} ⇒ ${JSON.stringify(expected)} y sin correo`, same(c.res, expected) && c.mails.length === 0, JSON.stringify(c.res));
}

// (25) opt-in con base y respaldo caídos ⇒ el contacto igual es { ok: true } y los logs no llevan datos personales
K.db = "fail";
K.failMail = (m) => m.subject.startsWith("Nueva suscripción");
c = await run(() => sendContactMessage({ ...form, newsletter: true, renderedAt: old() }));
report("contacto + opt-in fallido ⇒ { ok:true } y logs sin datos personales", same(c.res, { ok: true }) && leaks(c.log).length === 0, leaks(c.log).join(","));

// (26) newsletter con base y correo caídos ⇒ exactamente { ok: false, error: "unavailable" }
K.failMail = () => true;
c = await run(() => subscribeAction({ email: "ana@example.com", lang: "es", source: "home", website: "", renderedAt: old() }));
report("newsletter caído ⇒ { ok:false, error:'unavailable' }", same(c.res, { ok: false, error: "unavailable" }), JSON.stringify(c.res));
report("newsletter caído ⇒ logs sin correo completo, parámetros ni mensaje SMTP", leaks(c.log).length === 0 && c.log.includes("a***@example.com"), leaks(c.log).join(","));

// (27) respaldo por correo: el correo se recorta y pasa a minúsculas; respuesta uniforme
K.db = "off";
K.failMail = () => false;
c = await run(() => subscribeAction({ email: "  ANA@Example.com ", lang: "en", source: "footer", website: "", renderedAt: old() }));
report(
  "newsletter por correo ⇒ { ok:true, status:'queued' } con el correo normalizado",
  same(c.res, { ok: true, status: "queued" }) && c.mails.length === 1 && c.mails[0].text.includes("Email:       ana@example.com"),
  JSON.stringify(c.res),
);
c = await run(() => subscribeAction({ email: "ana@example.com", lang: "es", source: "home", website: "x", renderedAt: old() }));
report("newsletter, honeypot ⇒ { ok:true, status:'queued' } y sin correo", same(c.res, { ok: true, status: "queued" }) && c.mails.length === 0, JSON.stringify(c.res));
// El honeypot va antes de validar: uno de 300 caracteres (el esquema admite 200) o con otro campo
// inválido recibe la misma respuesta de éxito, sin correo.
c = await run(() => subscribeAction({ email: "ana@example.com", lang: "es", source: "home", website: "x".repeat(300), renderedAt: old() }));
report("newsletter, honeypot de 300 caracteres ⇒ queued y sin correo", same(c.res, { ok: true, status: "queued" }) && c.mails.length === 0, JSON.stringify(c.res));
c = await run(() => subscribeAction({ email: "ana@example.com", lang: "es", source: "otro", website: "x", renderedAt: old() }));
report("newsletter, honeypot con source inválido ⇒ queued y sin correo", same(c.res, { ok: true, status: "queued" }) && c.mails.length === 0, JSON.stringify(c.res));

// (27b) getClientIp dentro del try: si headers() falla, la acción no lanza y el log no lleva el correo
K.headersFail = true;
let threw = false;
try {
  c = await run(() => subscribeAction({ email: "ana@example.com", lang: "es", source: "home", website: "", renderedAt: old() }));
} catch {
  threw = true;
}
K.headersFail = false;
report(
  "newsletter, headers() falla ⇒ { ok:false, error:'unavailable' } sin lanzar y log sin el correo",
  !threw && same(c.res, { ok: false, error: "unavailable" }) && !c.log.includes("ana@example.com"),
  threw ? "lanzó" : JSON.stringify(c.res),
);

// (27c) analítica: con el honeypot lleno no se registra ningún envío (el cliente también lo mira)
const srcOf = (p) => readFileSync(ROOT + p, "utf8");
report(
  'contact-form.tsx: if (!values.website) track("contact_submit_success"',
  srcOf("app/[lang]/contacto/contact-form.tsx").includes('if (!values.website) track("contact_submit_success"'),
);
report(
  'newsletter-form.tsx: if (!website) track("newsletter_signup"',
  srcOf("components/phone/newsletter-form.tsx").includes('if (!website) track("newsletter_signup"'),
);
// La guarda va antes de safeParse en las dos acciones.
for (const p of ["app/[lang]/contacto/actions.ts", "app/actions/newsletter.ts"]) {
  const s = srcOf(p);
  const guard = s.indexOf("if (honeypotFilled(raw))");
  report(`${p}: honeypot antes de safeParse`, guard > 0 && guard < s.indexOf(".safeParse(raw)"));
}
c = await run(() => subscribe({ email: "ana@", lang: "es", source: "home", consentText: "ok" }));
report("subscribe con correo inválido ⇒ { ok:false, error:'invalid' }", same(c.res, { ok: false, error: "invalid" }), JSON.stringify(c.res));

// (28) errorInfo: solo clase y códigos con forma de código; nunca el mensaje ni texto libre
class DrizzleQueryError extends Error {}
const pgCause = Object.assign(new Error("terminating connection"), { code: "57P01" });
for (const [label, input, expected] of [
  [
    "nodemailer (ESOCKET sobre ECONNREFUSED)",
    Object.assign(new Error("connect ECONNREFUSED 203.0.113.9:465 ana@example.com"), { code: "ESOCKET", originalCode: "ECONNREFUSED", command: "CONN" }),
    { name: "Error", code: "ESOCKET", originalCode: "ECONNREFUSED", command: "CONN" },
  ],
  [
    "DrizzleQueryError con SQLSTATE en la causa",
    new DrizzleQueryError("Failed query: insert\nparams: ana@example.com", { cause: pgCause }),
    { name: "DrizzleQueryError", causeCode: "57P01" },
  ],
  [
    "code y command con texto libre se descartan",
    Object.assign(new Error("x"), { code: "rcpt ana@example.com rejected", command: "RCPT TO:<ana@example.com>" }),
    { name: "Error" },
  ],
  ["un string no es un Error", "ana@example.com", { type: "string" }],
  ["null", null, { type: "null" }],
]) {
  const got = errorInfo(input);
  report(`errorInfo: ${label}`, same(got, expected), JSON.stringify(got));
}

// (29) lib/mail.ts real sin credenciales: falla antes de crear el transporte (sin red) y deja un código en el log
delete process.env.ZOHO_SMTP_USER;
delete process.env.ZOHO_SMTP_PASS;
const { sendContactMail: realSendContactMail } = await load("lib/mail.ts");
let configError;
try {
  await realSendContactMail({ subject: "prueba", text: "prueba" });
} catch (err) {
  configError = err;
}
report(
  "lib/mail.ts sin credenciales ⇒ errorInfo { name:'Error', code:'EMAILCONFIG' }",
  same(errorInfo(configError), { name: "Error", code: "EMAILCONFIG" }),
  JSON.stringify(errorInfo(configError)),
);

process.exit(ok ? 0 : 1);
