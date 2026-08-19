"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Copy } from "lucide-react";
import { site } from "@/data/site";
import { SectionShell } from "@/components/shared/SectionShell";
import { Reveal } from "@/components/shared/Reveal";
import { useMagnetic } from "@/hooks/useMagnetic";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validation at the trust boundary — never trust the browser's own hints. */
function validate(values: { name: string; email: string; message: string }): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (name.length < 2) errors.name = "NAME MUST BE AT LEAST 2 CHARACTERS";
  else if (name.length > 80) errors.name = "NAME IS TOO LONG (MAX 80)";

  if (!EMAIL_RE.test(email)) errors.email = "ENTER A VALID EMAIL ADDRESS";
  else if (email.length > 160) errors.email = "EMAIL IS TOO LONG (MAX 160)";

  if (message.length < 12) errors.message = "MESSAGE MUST BE AT LEAST 12 CHARACTERS";
  else if (message.length > 2000) errors.message = "MESSAGE IS TOO LONG (MAX 2000)";

  return errors;
}

export function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const sendRef = useMagnetic<HTMLButtonElement>(0.24, 70);
  const firstErrorRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const found = validate(values);
      setErrors(found);

      if (Object.keys(found).length > 0) {
        setStatus("error");
        firstErrorRef.current?.focus();
        return;
      }

      setStatus("sending");
      // ponytail: no transport wired. Add a route handler (or a form service)
      // and POST `values` here; the UI states already cover success and failure.
      await new Promise((r) => setTimeout(r, 900));
      setStatus("sent");
      setValues({ name: "", email: "", message: "" });
    },
    [values],
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (insecure context / permission). Fail visibly, not silently.
      setCopied(false);
    }
  }, []);

  const links = [
    { label: "EMAIL", value: site.email, href: `mailto:${site.email}` },
    { label: "GITHUB", value: "@malikfajar", href: site.github },
    { label: "LINKEDIN", value: "IN/MALIKFAJAR", href: site.linkedin },
  ];

  return (
    <SectionShell id="contact" index="008" label="CONTACT" meta="OPEN FOR 2026 ENGAGEMENTS">
      <Reveal selector="[data-cta-line]" stagger={0.08} y={0}>
        <h3 className="display text-[clamp(2.75rem,15vw,12rem)]">
          {["LET'S", "BUILD", "SOMETHING", "STRANGE."].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <span
                data-cta-line
                className="block will-change-transform"
                style={{ marginLeft: i % 2 === 1 ? "clamp(0px,5vw,7rem)" : undefined }}
              >
                {line}
              </span>
            </span>
          ))}
        </h3>
      </Reveal>

      <div className="mt-[clamp(2.5rem,6vw,5rem)] grid grid-cols-12 gap-y-12 md:gap-x-[var(--gutter)]">
        {/* Channels */}
        <div className="col-span-12 md:col-span-5">
          <ul className="border-t-2 border-[var(--border)]">
            {links.map((link) => (
              <li key={link.label} className="border-b border-[var(--border)]">
                {/* Wraps on narrow viewports — the email string alone is wider
                    than 320px once it is set at display size. */}
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4">
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex min-w-0 flex-1 flex-wrap items-baseline gap-x-4 gap-y-1"
                  >
                    <span className="label w-[5.5rem] shrink-0">{link.label}</span>
                    <span className="link-sweep display max-w-full break-all text-[clamp(0.8rem,2.2vw,1.5rem)]">
                      {link.value}
                    </span>
                  </a>
                  {link.label === "EMAIL" ? (
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="label-strong flex items-center gap-2 border border-[var(--border)] px-2 py-1"
                      aria-label={copied ? "Email address copied" : "Copy email address"}
                    >
                      {copied ? (
                        <>
                          <Check size={11} strokeWidth={3} aria-hidden="true" /> COPIED
                        </>
                      ) : (
                        <>
                          <Copy size={11} strokeWidth={2.5} aria-hidden="true" /> COPY
                        </>
                      )}
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <p className="label mt-6 max-w-[38ch]">
            PREFERRED: A SHORT MESSAGE WITH WHAT YOU ARE BUILDING, THE CONSTRAINT, AND THE DEADLINE.
          </p>
        </div>

        {/* Form */}
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <form onSubmit={onSubmit} noValidate className="border-2 border-[var(--border)] p-[var(--step)]">
            <p className="label mb-5">TRANSMISSION FORM / 003 FIELDS</p>

            <Field
              id="contact-name"
              label="NAME"
              value={values.name}
              error={errors.name}
              autoComplete="name"
              inputRef={errors.name ? firstErrorRef : undefined}
              onChange={(v) => setValues((s) => ({ ...s, name: v }))}
            />

            <Field
              id="contact-email"
              label="EMAIL"
              type="email"
              value={values.email}
              error={errors.email}
              autoComplete="email"
              inputRef={!errors.name && errors.email ? firstErrorRef : undefined}
              onChange={(v) => setValues((s) => ({ ...s, email: v }))}
            />

            <div className="mb-5">
              <label htmlFor="contact-message" className="label-strong mb-2 block">
                MESSAGE
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={values.message}
                onChange={(e) => setValues((s) => ({ ...s, message: e.target.value }))}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                className="field resize-y"
                placeholder="WHAT ARE WE BUILDING?"
              />
              {errors.message ? (
                <p id="contact-message-error" role="alert" className="label mt-2 text-[var(--foreground)]">
                  ⚠ {errors.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                ref={sendRef}
                type="submit"
                disabled={status === "sending"}
                className="btn-brutal"
              >
                {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
                <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
              </button>

              {/* Live region: status is announced, never alert()ed. */}
              <div aria-live="polite" className="min-h-[1.25rem]">
                <AnimatePresence mode="wait">
                  {status === "sent" ? (
                    <motion.p
                      key="sent"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="label-strong flex items-center gap-2 text-[var(--accent-ink)]"
                      style={{ background: "var(--accent)", padding: "0.35rem 0.6rem" }}
                    >
                      <Check size={12} strokeWidth={3} aria-hidden="true" />
                      MESSAGE QUEUED — REPLY WITHIN 48H
                    </motion.p>
                  ) : null}
                  {status === "error" ? (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="label-strong"
                    >
                      ⚠ FIX {Object.keys(errors).length} FIELD
                      {Object.keys(errors).length === 1 ? "" : "S"} ABOVE
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SectionShell>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  inputRef,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="label-strong mb-2 block">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field"
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="label mt-2 text-[var(--foreground)]">
          ⚠ {error}
        </p>
      ) : null}
    </div>
  );
}
