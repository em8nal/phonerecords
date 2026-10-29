// Barril de lib/i18n/<sección>.ts: mismo objeto, claves y orden que antes de D0 (lo vigila pnpm test:i18n).
// Los textos se editan en lib/i18n/. Importes relativos sin extensión: los carga Node en las pruebas.
import { nav } from "./i18n/nav";
import { banner } from "./i18n/banner";
import { hero } from "./i18n/hero";
import { features } from "./i18n/features";
import { cta } from "./i18n/cta";
import { newsletter } from "./i18n/newsletter";
import { videos } from "./i18n/videos";
import { footer } from "./i18n/footer";
import type { AssertTrue, SameShape } from "./i18n/shape";

export const translations = {
  en: {
    nav: nav.en,
    banner: banner.en,
    hero: hero.en,
    features: features.en,
    cta: cta.en,
    newsletter: newsletter.en,
    videos: videos.en,
    footer: footer.en,
  },
  es: {
    nav: nav.es,
    banner: banner.es,
    hero: hero.es,
    features: features.es,
    cta: cta.es,
    newsletter: newsletter.es,
    videos: videos.es,
    footer: footer.es,
  },
} as const;

export type Language = keyof typeof translations;
export type Translations = (typeof translations)[Language];

/** No compila si a un idioma le falta o le sobra una clave o un elemento de arreglo, a cualquier profundidad. */
export type TranslationsShapeCheck = AssertTrue<SameShape<typeof translations.en, typeof translations.es>>;
