"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type BannerCarouselProps = {
  /** Clases de la caja de altura fija (la misma del banner simple). */
  frameClassName: string;
  /**
   * Cada slide viene renderizado por el servidor. `node` (textos) está en el HTML;
   * `media` (imagen de los slides 1+) se monta en el cliente tras hidratar.
   */
  slides: { id: string; node: ReactNode; media?: ReactNode }[];
  labels: {
    region: string;
    slide: string;
    prev: string;
    next: string;
    /** Contiene "{n}". */
    goTo: string;
    pause: string;
    play: string;
  };
};

// 8 s por slide: tiempo prudente para leer eyebrow + título + CTA (pedido de Claudio 21-10; asesoría ≥7 s). Bucle infinito.
const AUTOPLAY_MS = 8000;
const SWIPE_PX = 50;

const CONTROL_FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";

/**
 * Carrusel de banners. El estado inicial es el slide 0 y sin autoplay, así que
 * el HTML del servidor y la primera hidratación coinciden. Los slides no
 * activos se ocultan con opacity + `inert` (no reciben foco ni lectores de pantalla).
 */
export function BannerCarousel({ frameClassName, slides, labels }: BannerCarouselProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  // Autoplay solo tras montar y si el usuario no pidió menos movimiento.
  const [autoplay, setAutoplay] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const touchX = useRef<number | null>(null);
  const regionRef = useRef<HTMLElement>(null);

  // Tras hidratar (el LCP ya pintó el slide 0) se montan las imágenes diferidas.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReducedMotion(mq.matches);
      setAutoplay(!mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const running = autoplay && !userPaused && !hovered && !focused;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [running, count, index]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  };

  return (
    <section
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.region}
      // pt-20 = altura del menú fijo: el menú queda sobre el fondo claro y el banner empieza debajo.
      className="relative bg-background pt-20"
      onKeyDown={onKeyDown}
      // Hover solo con mouse/lápiz: en táctil no hay "salir", la pausa quedaría pegada.
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") setHovered(false);
      }}
      // Pausa por foco solo si es foco visible (teclado); un clic con mouse/touch en
      // flechas o puntos no debe frenar el autoplay.
      onFocus={(e) => {
        if ((e.target as HTMLElement).matches(":focus-visible")) setFocused(true);
      }}
      onBlur={(e) => {
        if (!regionRef.current?.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className={frameClassName}>
        <div
          // Mientras rota sola, "off" para no interrumpir al lector de pantalla;
          // sin autoplay (sin JS, pausado o movimiento reducido) anuncia los cambios.
          aria-live={running ? "off" : "polite"}
          className="absolute inset-0"
          onTouchStart={(e) => {
            touchX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchX.current;
            touchX.current = null;
            if (start == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? start) - start;
            if (Math.abs(dx) >= SWIPE_PX) go(dx < 0 ? index + 1 : index - 1);
          }}
        >
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription={labels.slide}
                aria-labelledby={slide.id}
                aria-hidden={active ? undefined : true}
                inert={!active}
                // Fundido en secuencia: el saliente se apaga rápido y el entrante aparece
                // después, para que nunca se superpongan los textos de dos banners.
                className={`absolute inset-0 transition-opacity ease-out motion-reduce:transition-none ${
                  active
                    ? "z-10 opacity-100 duration-500 delay-300"
                    : "pointer-events-none z-0 opacity-0 duration-300"
                }`}
              >
                {/* Imagen de los slides 1+: no está en el SSR, se monta tras hidratar. */}
                {mounted && slide.media}
                {slide.node}
              </div>
            );
          })}
        </div>

        {/* Controles: arriba a la derecha en móvil (el texto ocupa la base), abajo a la derecha desde md. */}
        <div className="absolute right-4 top-4 z-20 flex items-center gap-3 md:right-6 md:top-auto md:bottom-10 lg:right-12 lg:bottom-16">
          <div className="flex items-center">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={labels.goTo.replace("{n}", String(i + 1))}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
                className={`flex h-8 w-6 items-center justify-center rounded-full ${CONTROL_FOCUS}`}
              >
                <span
                  aria-hidden="true"
                  className={`block h-2 rounded-full bg-white transition-all ${
                    i === index ? "w-6 opacity-100" : "w-2 opacity-50"
                  }`}
                />
              </button>
            ))}
          </div>

          {!reducedMotion && autoplay && (
            <button
              type="button"
              aria-label={userPaused ? labels.play : labels.pause}
              onClick={() => setUserPaused((p) => !p)}
              className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 ${CONTROL_FOCUS}`}
            >
              {userPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            </button>
          )}

          <button
            type="button"
            aria-label={labels.prev}
            onClick={() => go(index - 1)}
            className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 ${CONTROL_FOCUS}`}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => go(index + 1)}
            className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 ${CONTROL_FOCUS}`}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
