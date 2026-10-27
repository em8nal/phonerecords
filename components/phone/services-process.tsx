import type { ServicesCopy } from "@/lib/services";

// "Del master al público": lista ordenada de cinco hitos unidos por una regla fina.
// Móvil y tablet: línea vertical a la izquierda con un punto por hito.
// Escritorio (≥1024): la regla gira a horizontal y los hitos quedan en cinco columnas
// (cinco hitos para cinco columnas: ninguna celda vacía). Server component, sin animación.
//
// role="list": con list-style none (preflight), Safari y VoiceOver le quitan la semántica de lista.
export function ServicesProcess({ steps }: { steps: ServicesCopy["process"]["steps"] }) {
  return (
    <ol
      role="list"
      className="relative ml-2 max-w-2xl space-y-10 border-l border-foreground/20 pl-8 lg:ml-0 lg:grid lg:max-w-none lg:grid-cols-5 lg:gap-6 lg:space-y-0 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-10 xl:gap-10"
    >
      {steps.map((step, i) => (
        <li key={step.id} className="relative">
          {/* Punto sobre la regla: centrado en la línea vertical (móvil) u horizontal (escritorio) */}
          <span
            aria-hidden="true"
            className="absolute -left-[calc(2rem+5.5px)] top-1.5 size-2.5 rounded-full bg-foreground lg:-top-[calc(2.5rem+5.5px)] lg:left-0"
          />
          <p aria-hidden="true" className="font-mono text-xs tracking-widest text-muted-foreground">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 font-display text-2xl tracking-tight lg:text-xl xl:text-2xl">{step.title}</h3>
          <p className="mt-3 text-base leading-relaxed text-foreground/75 lg:text-sm xl:text-base">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
