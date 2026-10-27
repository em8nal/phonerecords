import type { JourneyView, ServicesCopy } from "@/lib/services";

// "Tres recorridos de referencia": una escalera de bandas a lo ancho que crecen en contenido
// (4 → 6 → 9 líneas), no tres tarjetas iguales. La regla roja de cada banda avanza un tercio
// por recorrido. Lo heredado del recorrido anterior va atenuado; lo que suma, con "+".
// Las listas usan columnas CSS, no celdas, y el número de columnas sigue al de ítems para que
// ninguna quede en blanco (ver listClass). Server component.
const PROGRESS = ["w-1/3", "w-2/3", "w-full"] as const;

const LABEL = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

/**
 * Columnas de una lista según cuántos ítems trae: 1 → una; 2 y 4 → dos (con tres, la tercera
 * quedaría vacía: 1 + 1 + 0 o 2 + 2 + 0); el resto → dos desde sm y tres desde lg.
 */
function listClass(count: number): string {
  const columns = count <= 1 ? "" : count === 2 || count === 4 ? "sm:columns-2" : "sm:columns-2 lg:columns-3";
  return `mt-3 gap-8 ${columns}`;
}

type Props = {
  copy: ServicesCopy["journeys"];
  journeys: JourneyView[];
};

export function ServicesJourneys({ copy, journeys }: Props) {
  return (
    <>
      {/* role="list": con list-style none, Safari y VoiceOver le quitan la semántica de lista */}
      <ol role="list" className="border-b border-foreground/15">
        {journeys.map((journey, i) => (
          <li
            key={journey.id}
            className="relative grid gap-6 border-t border-foreground/15 py-10 lg:grid-cols-12 lg:gap-12 lg:py-14"
          >
            <span
              aria-hidden="true"
              className={`absolute -top-px left-0 h-0.5 bg-brand ${PROGRESS[i] ?? "w-full"}`}
            />
            <div className="lg:col-span-3">
              <p className={LABEL}>{copy.stepLabel.replace("{n}", String(i + 1).padStart(2, "0"))}</p>
              {/* text-5xl recién en xl: a 1024 "Desarrollado" no cabe en las 3 columnas y pisaría el gap */}
              <h3 className="mt-3 font-display text-4xl tracking-tight xl:text-5xl">{journey.name}</h3>
            </div>

            <div className="space-y-6 lg:col-span-9">
              {journey.previous && journey.inherited.length > 0 && (
                <div>
                  <p className={LABEL}>{copy.inherited.replace("{name}", journey.previous)}</p>
                  <ul role="list" className={`${listClass(journey.inherited.length)} text-base leading-relaxed text-muted-foreground`}>
                    {journey.inherited.map((item) => (
                      <li key={item} className="flex break-inside-avoid gap-3 py-1">
                        <span aria-hidden="true">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className={LABEL}>{journey.previous ? copy.adds : copy.includes}</p>
                <ul role="list" className={`${listClass(journey.adds.length)} text-lg leading-relaxed text-foreground`}>
                  {journey.adds.map((item) => (
                    <li key={item} className="flex break-inside-avoid gap-3 py-1">
                      <span aria-hidden="true" className="text-brand">
                        +
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {journey.note && <p className="text-sm leading-relaxed text-muted-foreground">{journey.note}</p>}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 max-w-[60ch] space-y-2 text-sm leading-relaxed text-muted-foreground">
        {copy.conditions.map((condition) => (
          <p key={condition}>{condition}</p>
        ))}
      </div>
    </>
  );
}
