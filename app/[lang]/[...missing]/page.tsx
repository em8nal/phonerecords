import { notFound } from "next/navigation";

// Una URL sin ruta bajo /es o /en no llega sola a app/[lang]/not-found.tsx: esa
// frontera solo atrapa notFound(). Esta ruta comodín lo llama para todo lo que no
// coincide con nada más. Las rutas estáticas y las de segmento dinámico ([slug])
// ganan siempre a un catch-all (orden de next/dist/shared/lib/router/utils/
// sorted-routes.js), así que /es/artistas/<slug> sigue en su página. Sin
// generateStaticParams: se resuelve por petición y no toca los params estáticos
// del layout [lang].
export default function MissingPage(): never {
  notFound();
}
