// Prueba del esquema del formulario de contacto (asunto "propuesta"):
//   node --import ./scripts/ts-resolve-hook.mjs scripts/test-contact.mjs
// Importa app/[lang]/contacto/contact-schema.ts (solo zod, sin directivas) y comprueba
// que los campos extra (enlaces, ciudad) se exigen solo con topic = "propuesta".
import {
  contactActionSchema,
  contactFormSchema,
  extractHttpsUrls,
  linkLines,
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
  "topicValues incluye propuesta (y los 4 anteriores)",
  JSON.stringify(topicValues) === JSON.stringify(["general", "booking", "prensa", "sello", "propuesta"]),
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

// (6b) honeypot lleno ⇒ falla en el esquema (la acción, además, responde ok silencioso)
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

process.exit(ok ? 0 : 1);
