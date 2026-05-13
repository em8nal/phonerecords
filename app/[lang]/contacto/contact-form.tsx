"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendContactMessage } from "./actions";

type Lang = "es" | "en";

const topicValues = ["general", "booking", "prensa", "sello"] as const;

const formSchema = z.object({
  name: z.string().trim().min(2, "min").max(120),
  email: z.string().trim().email("email"),
  topic: z.enum(topicValues),
  message: z.string().trim().min(10, "min").max(5000),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Copy = {
  name: string;
  email: string;
  topic: string;
  topics: Record<(typeof topicValues)[number], string>;
  message: string;
  submit: string;
  submitting: string;
  success: string;
  errorInvalid: string;
  errorSend: string;
  errors: { min: string; email: string };
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
    },
    message: "Mensaje",
    submit: "Enviar mensaje",
    submitting: "Enviando…",
    success: "Mensaje enviado. Te responderemos pronto.",
    errorInvalid: "Revisa los campos del formulario.",
    errorSend: "No pudimos enviar el mensaje. Intenta de nuevo en unos minutos.",
    errors: { min: "Muy corto.", email: "Email inválido." },
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
    },
    message: "Message",
    submit: "Send message",
    submitting: "Sending…",
    success: "Message sent. We'll be in touch.",
    errorInvalid: "Please check the form fields.",
    errorSend: "We couldn't send your message. Try again in a moment.",
    errors: { min: "Too short.", email: "Invalid email." },
  },
};

export function ContactForm({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const [isPending, startTransition] = useTransition();
  const [serverState, setServerState] = useState<
    { kind: "idle" } | { kind: "ok" } | { kind: "err"; msg: string }
  >({ kind: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      topic: "general",
      message: "",
      website: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      setServerState({ kind: "idle" });
      const res = await sendContactMessage({ ...values, lang });
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
          {...register("email")}
          className={fieldClass}
        />
      </Field>

      <Field id="topic" label={c.topic}>
        <select
          id="topic"
          {...register("topic")}
          className={`${fieldClass} appearance-none pr-10 bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2020%2020%22%20fill=%22currentColor%22><path%20d=%22M5.5%208l4.5%204.5L14.5%208z%22/></svg>')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem]`}
        >
          {topicValues.map((v) => (
            <option key={v} value={v}>
              {c.topics[v]}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id="message"
        label={c.message}
        error={errors.message ? c.errors.min : undefined}
      >
        <textarea
          id="message"
          rows={6}
          {...register("message")}
          className={`${fieldClass} resize-y min-h-[160px]`}
        />
      </Field>

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

const fieldClass =
  "w-full bg-transparent border border-foreground/15 rounded-xl px-4 h-12 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 transition-colors";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
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
      {error && <p className="text-xs text-red-500/90">{error}</p>}
    </div>
  );
}
