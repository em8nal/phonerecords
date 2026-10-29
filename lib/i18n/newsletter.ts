// Newsletter: formulario independiente (components/phone/newsletter-form.tsx), casilla y bloque
// de /contacto (contact-form.tsx, page.tsx, actions.ts) y app/actions/newsletter.ts.
// Ojo: `consent` (app/actions/newsletter.ts) y `checkbox` (contacto/actions.ts) se guardan tal cual
// como texto del consentimiento.
export const newsletter = {
  en: {
    title: "Newsletter",
    description:
      "New releases, concerts and journal entries from PHŌNÉ, by email. Nothing else.",
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    submit: "Subscribe",
    submitting: "Subscribing…",
    // Exact phrase stored as consent when using the standalone form.
    consent:
      "I agree to receive the PHŌNÉ Records newsletter by email. I can unsubscribe at any time.",
    // Checkbox in the contact form (also stored as consent text).
    checkbox:
      "I want to receive PHŌNÉ news by email (releases, concerts, journal)",
    checkboxNote:
      "Optional. We store your email, language and consent date. Details in our",
    privacyLink: "privacy policy",
    success: "Done. If the email is valid, it will be subscribed.",
    errorInvalid: "Enter a valid email address.",
    errorUnavailable:
      "We couldn't complete your subscription. Please try again in a few minutes.",
  },
  es: {
    title: "Newsletter",
    description:
      "Lanzamientos, conciertos y entradas del journal de PHŌNÉ, por correo. Nada más.",
    emailLabel: "Email",
    emailPlaceholder: "tu@email.com",
    submit: "Suscribirme",
    submitting: "Suscribiendo…",
    // Frase exacta que se guarda como consentimiento en el formulario independiente.
    consent:
      "Acepto recibir el newsletter de PHŌNÉ Records por correo. Puedo darme de baja cuando quiera.",
    // Checkbox del formulario de contacto (también se guarda como consentimiento).
    checkbox:
      "Quiero recibir novedades de PHŌNÉ por correo (lanzamientos, conciertos, journal)",
    checkboxNote:
      "Opcional. Guardamos tu correo, idioma y fecha de consentimiento. Detalles en nuestra",
    privacyLink: "política de privacidad",
    success: "Listo. Si el correo es válido, quedará suscrito.",
    errorInvalid: "Ingresa un correo válido.",
    errorUnavailable:
      "No pudimos completar la suscripción. Intenta de nuevo en unos minutos.",
  },
} as const;
