// Menú superior (components/landing/navigation.tsx). Mismas claves en los dos idiomas.
// `developers` no tiene lectores hoy; se conserva para no cambiar el objeto (lo vigila test:i18n).
export const nav = {
  en: {
    features: "Services",
    howItWorks: "Manifesto",
    developers: "Events",
    label: "Label",
    videos: "Videos",
    signIn: "Press",
    startCreating: "Newsletter",
  },
  es: {
    features: "Servicios",
    howItWorks: "Manifiesto",
    developers: "Eventos",
    label: "Sello",
    videos: "Videos",
    signIn: "Prensa",
    startCreating: "Newsletter",
  },
} as const;
