// Prueba de ventanas del carrusel: pnpm test:banners  (node --import ./scripts/ts-resolve-hook.mjs scripts/test-banners.mjs)
import { getActiveBanners } from "../lib/banner.ts";

const cases = [
  ["2026-10-21T12:00:00-03:00", ["klaus-b-destellos-de-ti", "newen-afrobeat-la-fuerza", "con-fusion-cuantas-veces", "con-fusion-la-banca"]],
  ["2026-10-23T12:00:00-03:00", ["newen-afrobeat-la-fuerza", "klaus-b-destellos-de-ti", "con-fusion-cuantas-veces", "con-fusion-la-banca"]],
  ["2026-10-30T12:00:00-03:00", ["newen-afrobeat-la-fuerza", "klaus-b-destellos-de-ti", "con-fusion-cuantas-veces", "con-fusion-la-banca"]],
  ["2026-11-05T12:00:00-03:00", ["klaus-b-un-rezo", "newen-afrobeat-la-fuerza", "con-fusion-cuantas-veces", "con-fusion-la-banca"]],
  // La Banca termina el 2026-11-30 (valor exacto del brief).
  ["2026-11-20T12:00:00-03:00", ["klaus-b-una-cuota-de-caos", "newen-afrobeat-la-fuerza", "con-fusion-cuantas-veces", "con-fusion-la-banca"]],
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
