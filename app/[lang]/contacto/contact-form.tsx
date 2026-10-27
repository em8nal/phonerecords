"use client";

import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { useForm, type UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { translations } from "@/lib/translations";
import { sendContactMessage } from "./actions";
import {
  contactFormSchema,
  projectTypeLabels,
  projectTypeValues,
  serviceInterestLabels,
  serviceInterestValues,
  topicValues,
  type Topic,
} from "./contact-schema";

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
  // Asunto "servicios" (las etiquetas de casillas y tipos viven en contact-schema.ts)
  services: string;
  projectType: string;
  releaseWindow: string;
  releaseWindowPlaceholder: string;
  linksOptional: string;
  linksHintServices: string;
  message: string;
  messagePlaceholderProposal: string;
  messagePlaceholderServices: string;
  submit: string;
  submitting: string;
  success: string;
  errorInvalid: string;
  errorSend: string;
  errors: {
    min: string;
    email: string;
    links: string;
    city: string;
    services: string;
    projectType: string;
    releaseWindow: string;
  };
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
      servicios: "Dirección creativa, diseño y prensa",
    },
    links: "Enlaces",
    linksHint: "Uno por línea; al menos uno completo (https://…).",
    linksPlaceholder: "Spotify, YouTube, Bandcamp, Instagram…",
    city: "Ciudad",
    services: "Servicios de interés",
    projectType: "Tipo de proyecto",
    releaseWindow: "Fecha estimada de lanzamiento (opcional)",
    releaseWindowPlaceholder: "Ej.: marzo 2027",
    linksOptional: "Enlaces (opcional)",
    linksHintServices: "Uno por línea: maquetas, Spotify, YouTube, referencias…",
    message: "Mensaje",
    messagePlaceholderProposal:
      "Cuéntanos quién eres y qué estás preparando (pocas líneas).",
    messagePlaceholderServices:
      "Cuéntanos en qué etapa está tu proyecto y qué te gustaría lograr.",
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
      services: "Marca al menos una opción.",
      projectType: "Elige el tipo de proyecto.",
      releaseWindow: "Usa una sola línea.",
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
      servicios: "Creative direction, design & press",
    },
    links: "Links",
    linksHint: "One per line; at least one full link (https://…).",
    linksPlaceholder: "Spotify, YouTube, Bandcamp, Instagram…",
    city: "City",
    services: "Services you're interested in",
    projectType: "Project type",
    releaseWindow: "Estimated release date (optional)",
    releaseWindowPlaceholder: "e.g. March 2027",
    linksOptional: "Links (optional)",
    linksHintServices: "One per line: demos, Spotify, YouTube, references…",
    message: "Message",
    messagePlaceholderProposal:
      "Tell us who you are and what you're working on (a few lines).",
    messagePlaceholderServices:
      "Tell us what stage your project is at and what you'd like to achieve.",
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
      services: "Choose at least one option.",
      projectType: "Choose the project type.",
      releaseWindow: "Use a single line.",
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
      services: [],
      projectType: undefined,
      releaseWindow: "",
      website: "",
      newsletter: false,
    },
  });

  // Campos por asunto: enlaces y ciudad con "Propuesta de artista"; servicios de interés, tipo de
  // proyecto, fecha estimada y enlaces (opcionales) con "Dirección creativa, diseño y prensa".
  const topic = watch("topic");
  const isProposal = topic === "propuesta";
  const isServices = topic === "servicios";

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      setServerState({ kind: "idle" });
      // Cada campo extra viaja solo con su asunto (RHF conserva los valores de campos desmontados).
      const withProposal = values.topic === "propuesta";
      const withServices = values.topic === "servicios";
      const payload = {
        ...values,
        links: withProposal || withServices ? values.links : undefined,
        city: withProposal ? values.city : undefined,
        services: withServices ? values.services : undefined,
        projectType: withServices ? values.projectType : undefined,
        releaseWindow: withServices ? values.releaseWindow : undefined,
      };
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
      {/* ?topic=booking|propuesta|servicios (footer, menú y /servicios) preselecciona el asunto. Solo este hijo nulo
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
            // Al cambiar de asunto, los errores de los campos por asunto no deben quedar colgando.
            onChange: () => clearErrors(["links", "city", "services", "projectType", "releaseWindow"]),
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

      {isServices && (
        <>
          <fieldset aria-describedby={errors.services ? "services-error" : undefined}>
            <legend className={legendClass}>{c.services}</legend>
            <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
              {serviceInterestValues.map((value) => (
                <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 text-base">
                  <input
                    type="checkbox"
                    value={value}
                    aria-invalid={errors.services ? true : undefined}
                    {...register("services")}
                    className={choiceClass}
                  />
                  {serviceInterestLabels[value][lang]}
                </label>
              ))}
            </div>
            {errors.services && (
              <p id="services-error" className="mt-2 text-xs text-brand">
                {c.errors.services}
              </p>
            )}
          </fieldset>

          {/* Los radios no admiten aria-invalid: el error llega por el aria-describedby del grupo. */}
          <fieldset aria-describedby={errors.projectType ? "projectType-error" : undefined}>
            <legend className={legendClass}>{c.projectType}</legend>
            <div className="mt-2 grid grid-cols-2 gap-x-6 sm:grid-cols-4">
              {projectTypeValues.map((value) => (
                <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 text-base">
                  <input
                    type="radio"
                    value={value}
                    {...register("projectType")}
                    className={choiceClass}
                  />
                  {projectTypeLabels[value][lang]}
                </label>
              ))}
            </div>
            {errors.projectType && (
              <p id="projectType-error" className="mt-2 text-xs text-brand">
                {c.errors.projectType}
              </p>
            )}
          </fieldset>

          <Field
            id="releaseWindow"
            label={c.releaseWindow}
            error={errors.releaseWindow ? c.errors.releaseWindow : undefined}
          >
            <input
              id="releaseWindow"
              type="text"
              maxLength={60}
              autoComplete="off"
              placeholder={c.releaseWindowPlaceholder}
              aria-invalid={errors.releaseWindow ? true : undefined}
              aria-describedby={errors.releaseWindow ? "releaseWindow-error" : undefined}
              {...register("releaseWindow")}
              className={fieldClass}
            />
          </Field>
        </>
      )}

      {(isProposal || isServices) && (
        <Field
          id="links"
          label={isServices ? c.linksOptional : c.links}
          hint={isServices ? c.linksHintServices : c.linksHint}
          error={errors.links ? c.errors.links : undefined}
        >
          <textarea
            id="links"
            rows={3}
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
      )}

      {isProposal && (
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
      )}

      <Field
        id="message"
        label={c.message}
        error={errors.message ? c.errors.min : undefined}
      >
        <textarea
          id="message"
          rows={6}
          placeholder={
            isProposal
              ? c.messagePlaceholderProposal
              : isServices
                ? c.messagePlaceholderServices
                : undefined
          }
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
          className="text-sm text-brand"
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

/** Leyenda de un grupo de casillas o radios: mismo estilo que el label de los campos. */
const legendClass = "block text-xs font-mono uppercase tracking-widest text-muted-foreground";

/** Casillas y radios: tamaño fijo dentro de una fila de 44 px y el anillo de foco del sitio. */
const choiceClass =
  "size-4 shrink-0 accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const fieldClass =
  "w-full bg-transparent border border-foreground/15 rounded-xl px-4 h-12 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors";

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
        <p id={`${id}-error`} className="text-xs text-brand">
          {error}
        </p>
      )}
    </div>
  );
}
