// Prueba de ventanas del carrusel: node scripts/test-banners.mjs
import { getActiveBanners } from "../lib/banner.ts";

const cases = [
  ["2026-10-21T12:00:00-03:00", ["klaus-b-destellos-de-ti", "con-fusion-cuantas-veces", "con-fusion-la-banca"]],
  ["2026-11-05T12:00:00-03:00", ["klaus-b-un-rezo", "con-fusion-cuantas-veces", "con-fusion-la-banca"]],
  // El brief esperaba solo 2 aquí, pero La Banca termina el 2026-11-30 (valor exacto del brief).
  ["2026-11-20T12:00:00-03:00", ["klaus-b-una-cuota-de-caos", "con-fusion-cuantas-veces", "con-fusion-la-banca"]],
  ["2026-11-30T12:00:00-03:00", ["klaus-b-una-cuota-de-caos", "con-fusion-cuantas-veces"]],
  ["2026-12-01T12:00:00-03:00", ["klaus-b-una-cuota-de-caos"]],
];
let ok = true;
for (const [iso, expected] of cases) {
  const got = getActiveBanners(new Date(iso)).map((b) => b.slug);
  const pass = JSON.stringify(got) === JSON.stringify(expected);
  ok &&= pass;
  console.log(`${pass ? "OK  " : "FAIL"} ${iso} -> ${got.join(" > ")}`);
}
process.exit(ok ? 0 : 1);
