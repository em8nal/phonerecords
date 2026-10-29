// Prueba del esquema del formulario de contacto (asuntos "propuesta" y "servicios"):
//   node --import ./scripts/ts-resolve-hook.mjs scripts/test-contact.mjs
// Importa app/[lang]/contacto/contact-schema.ts (solo zod, sin directivas) y comprueba
// que los campos extra se exigen solo con su asunto: enlaces y ciudad con "propuesta";
// servicios de interés y tipo de proyecto con "servicios" (fecha estimada y enlaces, opcionales).
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

// (6b) honeypot lleno ⇒ falla en el esquema (por eso la acción responde "invalid": ver el caso 24)
const r6b = contactActionSchema.safeParse({ ...base, topic: "general", website: "http://spam" });
report("honeypot lleno ⇒ falla en website", !r6b.success && issuePaths(r6b).includes("website"), issuePaths(r6b).join(","));

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

process.exit(ok ? 0 : 1);
