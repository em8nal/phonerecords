"use client";

import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { useForm, type UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { translations } from "@/lib/translations";
import { sendContactMessage } from "./actions";
import { contactFormSchema, topicValues, type Topic } from "./contact-schema";

type Lang = "es" | "en";

type FormValues = z.infer<typeof contactFormSchema>;

type Copy = {
  name: string;
  email: string;
  topic: string;
  topics: Record<Topic, string>;
  links: string;
  linksHint: string;
  linksPlaceholder: string;
  city: string;
  message: string;
  messagePlaceholderProposal: string;
  submit: string;
  submitting: string;
  success: string;
  errorInvalid: string;
  errorSend: string;
  errors: { min: string; email: string; links: string; city: string };
};

const copy: Record<Lang, Copy> = {
  es: {
    name: "Nombre",
    email: "Email",
    topic: "Asunto",
    topics: {
      general: "General",
      booking: "Booking",
      prensa: "Prensa",
      sello: "Sello",
      propuesta: "Propuesta de artista",
    },
    links: "Enlaces",
    linksHint: "Uno por línea; al menos uno completo (https://…).",
    linksPlaceholder: "Spotify, YouTube, Bandcamp, Instagram…",
    city: "Ciudad",
    message: "Mensaje",
    messagePlaceholderProposal:
      "Cuéntanos quién eres y qué estás preparando (pocas líneas).",
    submit: "Enviar mensaje",
    submitting: "Enviando…",
    success: "Mensaje enviado. Te responderemos pronto.",
    errorInvalid: "Revisa los campos del formulario.",
    errorSend: "No pudimos enviar el mensaje. Intenta de nuevo en unos minutos.",
    errors: {
      min: "Muy corto.",
      email: "Email inválido.",
      links: "Incluye al menos un enlace completo (https://…).",
      city: "Indica tu ciudad.",
    },
  },
  en: {
    name: "Name",
    email: "Email",
    topic: "Subject",
    topics: {
      general: "General",
      booking: "Booking",
      prensa: "Press",
      sello: "Label",
      propuesta: "Artist proposal",
    },
    links: "Links",
    linksHint: "One per line; at least one full link (https://…).",
    linksPlaceholder: "Spotify, YouTube, Bandcamp, Instagram…",
    city: "City",
    message: "Message",
    messagePlaceholderProposal:
      "Tell us who you are and what you're working on (a few lines).",
    submit: "Send message",
    submitting: "Sending…",
    success: "Message sent. We'll be in touch.",
    errorInvalid: "Please check the form fields.",
    errorSend: "We couldn't send your message. Try again in a moment.",
    errors: {
      min: "Too short.",
      email: "Invalid email.",
      links: "Include at least one full link (https://…).",
      city: "Tell us your city.",
    },
  },
};

export function ContactForm({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const nl = translations[lang].newsletter;
  const [isPending, startTransition] = useTransition();
  const [serverState, setServerState] = useState<
    { kind: "idle" } | { kind: "ok" } | { kind: "err"; msg: string }
  >({ kind: "idle" });
  // Marca de tiempo del render: la acción rechaza envíos en menos de 2 s (como el newsletter).
  const renderedAt = useRef(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      topic: "general",
      message: "",
      links: "",
      city: "",
      website: "",
      newsletter: false,
    },
  });

  // Enlaces y ciudad solo existen (y solo se validan) con el asunto "Propuesta de artista".
  const isProposal = watch("topic") === "propuesta";

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      setServerState({ kind: "idle" });
      // Fuera de "propuesta", enlaces y ciudad no viajan (RHF conserva los valores de campos desmontados).
      const payload =
        values.topic === "propuesta"
          ? values
          : { ...values, links: undefined, city: undefined };
      const res = await sendContactMessage({
        ...payload,
        lang,
        renderedAt: renderedAt.current,
      });
      if (res.ok) {
        setServerState({ kind: "ok" });
        reset();
      } else if (res.error === "invalid") {
        setServerState({ kind: "err", msg: c.errorInvalid });
      } else {
        setServerState({ kind: "err", msg: c.errorSend });
      }
    });
  };

  if (serverState.kind === "ok") {
    return (
      <div className="border border-foreground/15 rounded-2xl p-8 lg:p-10 bg-foreground/[0.02]">
        <p className="text-base leading-relaxed">{c.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-busy={isPending}
    >
      {/* ?topic=booking|propuesta (footer y menú) preselecciona el asunto. Solo este hijo nulo
          lee la query, así el formulario sigue prerenderizado y el asunto también cambia en una
          navegación suave con next/link desde esta misma página. */}
      <Suspense fallback={null}>
        <TopicFromQuery setValue={setValue} />
      </Suspense>

      {/* Honeypot — hidden from humans, visible to dumb bots */}
      <div aria-hidden className="hidden" style={{ display: "none" }}>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <Field
        id="name"
        label={c.name}
        error={errors.name ? c.errors.min : undefined}
      >
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
          className={fieldClass}
        />
      </Field>

      <Field
        id="email"
        label={c.email}
        error={errors.email ? c.errors.email : undefined}
      >
        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
          className={fieldClass}
        />
      </Field>

      <Field id="topic" label={c.topic}>
        <select
          id="topic"
          {...register("topic", {
            // Al cambiar de asunto, los errores de los campos de propuesta no deben quedar colgando.
            onChange: () => clearErrors(["links", "city"]),
          })}
          className={`${fieldClass} appearance-none pr-10 bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2020%2020%22%20fill=%22currentColor%22><path%20d=%22M5.5%208l4.5%204.5L14.5%208z%22/></svg>')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem]`}
        >
          {topicValues.map((v) => (
            <option key={v} value={v}>
              {c.topics[v]}
            </option>
          ))}
        </select>
      </Field>

      {isProposal && (
        <>
          <Field
            id="links"
            label={c.links}
            hint={c.linksHint}
            error={errors.links ? c.errors.links : undefined}
          >
            <textarea
              id="links"
              rows={3}
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder={c.linksPlaceholder}
              aria-invalid={errors.links ? true : undefined}
              aria-describedby={errors.links ? "links-error links-hint" : "links-hint"}
              {...register("links")}
              className={`${fieldClass} resize-y min-h-24 py-3`}
            />
          </Field>

          <Field
            id="city"
            label={c.city}
            error={errors.city ? c.errors.city : undefined}
          >
            <input
              id="city"
              type="text"
              autoComplete="address-level2"
              aria-invalid={errors.city ? true : undefined}
              aria-describedby={errors.city ? "city-error" : undefined}
              {...register("city")}
              className={fieldClass}
            />
          </Field>
        </>
      )}

      <Field
        id="message"
        label={c.message}
        error={errors.message ? c.errors.min : undefined}
      >
        <textarea
          id="message"
          rows={6}
          placeholder={isProposal ? c.messagePlaceholderProposal : undefined}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
          className={`${fieldClass} resize-y min-h-[160px] py-3`}
        />
      </Field>

      <div className="flex items-start gap-3">
        <input
          id="newsletter"
          type="checkbox"
          aria-describedby="newsletter-note"
          {...register("newsletter")}
          className="mt-1 size-4 shrink-0 accent-foreground"
        />
        <div className="space-y-1">
          <label htmlFor="newsletter" className="text-sm leading-snug">
            {nl.checkbox}
          </label>
          <p
            id="newsletter-note"
            className="text-xs text-muted-foreground leading-relaxed"
          >
            {nl.checkboxNote}{" "}
            <Link
              href={`/${lang}/privacidad`}
              className="underline underline-offset-2 hover:text-foreground rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {nl.privacyLink}
            </Link>
            .
          </p>
        </div>
      </div>

      {serverState.kind === "err" && (
        <p
          role="alert"
          className="text-sm text-red-500/90"
        >
          {serverState.msg}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center px-8 h-12 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-60 transition-colors"
      >
        {isPending ? c.submitting : c.submit}
      </button>
    </form>
  );
}

/** Sincroniza el asunto con `?topic=` (valores desconocidos se ignoran). No pinta nada. */
function TopicFromQuery({ setValue }: { setValue: UseFormSetValue<FormValues> }) {
  const wanted = useSearchParams().get("topic");
  useEffect(() => {
    if (wanted && (topicValues as readonly string[]).includes(wanted)) {
      setValue("topic", wanted as Topic);
    }
  }, [wanted, setValue]);
  return null;
}

const fieldClass =
  "w-full bg-transparent border border-foreground/15 rounded-xl px-4 h-12 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 transition-colors";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  /** Ayuda permanente bajo el campo; su id (`<id>-hint`) va en el aria-describedby del control. */
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-xs font-mono uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500/90">
          {error}
        </p>
      )}
    </div>
  );
}
