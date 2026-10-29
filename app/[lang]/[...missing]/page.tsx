import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Una URL sin ruta bajo /es o /en no llega sola a app/[lang]/not-found.tsx: esa
// frontera solo atrapa notFound(). Esta ruta comodín lo llama para todo lo que no
// coincide con nada más. Las rutas estáticas y las de segmento dinámico ([slug])
// ganan siempre a un catch-all (orden de next/dist/shared/lib/router/utils/
// sorted-routes.js), así que /es/artistas/<slug> sigue en su página. Sin
// generateStaticParams: ISR bajo demanda (cada URL se renderiza en su primera visita
// y queda en caché), sin tocar los params estáticos del layout [lang].

type MissingParams = { lang: string; missing: string[] };

// <title> de la 404 en su idioma ("Página no encontrada — PHŌNÉ Records" con la plantilla).
// Lo da esta página y no not-found.tsx: Next solo usa la metadata de la frontera not-found
// cuando el que lanza notFound() es generateMetadata (next/dist/lib/metadata/metadata.js);
// si lo lanza el componente, se queda la de la página. Por eso aquí no se lanza. El render
// sigue respondiendo 404 con noindex y la UI de not-found.tsx.
export async function generateMetadata(
  { params }: { params: Promise<MissingParams> }
): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "en" ? "Page not found" : "Página no encontrada" };
}

export default function MissingPage(): never {
  notFound();
}
