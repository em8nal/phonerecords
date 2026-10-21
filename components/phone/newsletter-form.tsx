"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { subscribeAction } from "@/app/actions/newsletter";
import { translations } from "@/lib/translations";

type Props = {
  lang: "es" | "en";
  source: "contacto" | "home";
  className?: string;
};

type State =
  | { kind: "idle" }
  | { kind: "ok"; msg: string }
  | { kind: "err"; msg: string };

export function NewsletterForm({ lang, source, className }: Props) {
  const n = translations[lang].newsletter;
  const uid = useId();
  const emailId = `${uid}-email`;
  const msgId = `${uid}-msg`;
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<State>({ kind: "idle" });
  const renderedAt = useRef<number>(0);

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const website = String(data.get("website") ?? "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({ kind: "err", msg: n.errorInvalid });
      return;
    }

    startTransition(async () => {
      setState({ kind: "idle" });
      const res = await subscribeAction({
        email,
        lang,
        source,
        website,
        renderedAt: renderedAt.current,
      });
      if (res.ok) {
        setState({ kind: "ok", msg: n.success });
        form.reset();
      } else {
        setState({
          kind: "err",
          msg: res.error === "invalid" ? n.errorInvalid : n.errorUnavailable,
        });
      }
    });
  };

  const hasMsg = state.kind !== "idle";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={isPending}
      className={className}
    >
      {/* Honeypot: oculto para personas, visible para bots simples */}
      <div aria-hidden className="hidden" style={{ display: "none" }}>
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label
        htmlFor={emailId}
        className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2"
      >
        {n.emailLabel}
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={n.emailPlaceholder}
          aria-invalid={state.kind === "err"}
          aria-describedby={hasMsg ? msgId : undefined}
          className="flex-1 min-w-0 bg-transparent border border-foreground/15 rounded-full px-5 h-12 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 transition-colors"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center px-8 h-12 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-60 transition-colors"
        >
          {isPending ? n.submitting : n.submit}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
        {n.consent}{" "}
        <Link
          href={`/${lang}/privacidad`}
          className="underline underline-offset-2 hover:text-foreground"
        >
          {n.privacyLink}
        </Link>
        .
      </p>

      <p
        id={msgId}
        aria-live={state.kind === "err" ? "assertive" : "polite"}
        aria-atomic="true"
        className={`text-sm mt-3 min-h-5 ${
          state.kind === "err" ? "text-red-500/90" : "text-foreground/85"
        }`}
      >
        {hasMsg ? state.msg : ""}
      </p>
    </form>
  );
}
